import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { JWT_SECRET, GOOGLE_CLIENT_ID, CLIENT_URL } from "../config";
import { RegisterDto, LoginDto, GoogleAuthDto, ResetPasswordDto } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";
import { IUserRepository, UserRepository } from "../repositories/user.repository";
import { UserType } from "../types/user.type";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { sendEmail } from "../config/email";
import { getResetPasswordEmailTemplate } from "../templates/reset-password-email";

export type SafeUser = Omit<UserType, "password">;

export class AuthService {
    private userRepository: IUserRepository;
    private googleClient: OAuth2Client;

    constructor(userRepository: IUserRepository = new UserRepository()) {
        this.userRepository = userRepository;
        this.googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    }

    async register(payload: RegisterDto): Promise<{ token: string; user: SafeUser }> {
        const data = RegisterDto.parse(payload);
        const normalizedEmail = data.email.toLowerCase();
        const existingByUid = await this.userRepository.getUser(data.uid);
        const existingByEmail = await this.userRepository.getUserByEmail(normalizedEmail);
        if (existingByUid || existingByEmail) {
            throw new HttpError(409, "User already exists");
        }

        if (!data.password) {
            throw new HttpError(400, "Password is required for registration");
        }

        const hashedPassword = await bcryptjs.hash(data.password, 10);
        const userToCreate: UserType = {
            uid: data.uid,
            fullName: data.fullName,
            email: normalizedEmail,
            allergenicIngredients: data.allergenicIngredients,
            authProvider: data.authProvider,
            role: "user",
            profilePic: data.profilePic,
            password: hashedPassword,
            createdAt: data.createdAt ?? new Date(),
            updatedAt: data.updatedAt ?? new Date(),
            isSubscribedUser: false,
        };

        const created = await this.userRepository.createUser(userToCreate);
        const token = this.generateToken(created);
        return { token, user: this.sanitizeUser(created) };
    }

    async login(payload: LoginDto): Promise<{ token: string; user: SafeUser }> {
        const data = LoginDto.parse(payload);
        const normalizedEmail = data.email.toLowerCase();
        const user = await this.userRepository.getUserByEmail(normalizedEmail);
        if (!user) {
            throw new HttpError(404, "No user found");
        }

        if (!user.password) {
            throw new HttpError(400, "This account uses Google Sign-In. Please login with Google.");
        }

        const validPassword = await bcryptjs.compare(data.password, user.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid password");
        }

        const token = this.generateToken(user);
        return { token, user: this.sanitizeUser(user) };
    }

    async googleLogin(payload: GoogleAuthDto): Promise<{ token: string; user: SafeUser; isNewUser: boolean }> {
        const data = GoogleAuthDto.parse(payload);

        // Verify Google ID token
        let googlePayload;
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: data.idToken,
                audience: GOOGLE_CLIENT_ID,
            });
            googlePayload = ticket.getPayload();
        } catch (error) {
            throw new HttpError(401, "Invalid Google token");
        }

        if (!googlePayload || !googlePayload.email) {
            throw new HttpError(401, "Invalid Google token payload");
        }

        const email = googlePayload.email.toLowerCase();
        const existingUser = await this.userRepository.getUserByEmail(email);

        if (existingUser) {
            // User exists - log them in
            const token = this.generateToken(existingUser);
            return { token, user: this.sanitizeUser(existingUser), isNewUser: false };
        }

        // New user - create account
        const newUser: UserType = {
            uid: uuidv4(),
            fullName: googlePayload.name || email.split("@")[0],
            email: email,
            profilePic: googlePayload.picture || "",
            allergenicIngredients: [],
            authProvider: "google",
            role: "user",
            password: undefined, // No password for OAuth users
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubscribedUser: false,
        };

        const created = await this.userRepository.createUser(newUser);
        const token = this.generateToken(created);
        return { token, user: this.sanitizeUser(created), isNewUser: true };
    }

    private generateToken(user: UserType): string {
        const payload = {
            id: user.uid,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
    }

    private sanitizeUser(user: UserType): SafeUser {
        // Convert Mongoose document to plain object if needed
        const userObj = typeof (user as any).toObject === 'function'
            ? (user as any).toObject()
            : user;
        const { password, _id, __v, ...safeUser } = userObj;
        return safeUser;
    }

    // Update user profile (for authenticated users)
    async updateUserProfile(uid: string, updates: any, file?: Express.Multer.File): Promise<SafeUser | null> {
        const existing = await this.userRepository.getUser(uid);
        if (!existing) {
            return null;
        }

        if (file) {
            const port = process.env.PORT || 5000;
            const ext = file.filename.split('.').pop();
            const oldPath = file.path;
            const newFilename = `pp-${uid}.${ext}`;
            const newPath = path.join(path.dirname(oldPath), newFilename);

            try {
                if (fs.existsSync(newPath)) {
                }
                fs.renameSync(oldPath, newPath);
                updates.profilePic = `http://localhost:${port}/public/profilePic/${newFilename}`;
            } catch (error) {
                console.error("Error renaming profile pic:", error);

                throw new HttpError(500, "Failed to process profile picture");
            }
        }

        const updatedUser = await this.userRepository.updateUser(uid, updates);
        if (!updatedUser) {
            return null;
        }

        return this.sanitizeUser(updatedUser);
    }

    async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpError(400, "Email is required");
        }
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        const html = getResetPasswordEmailTemplate(resetLink);
        await sendEmail(user.email, "Reset Your Yumm AI Password", html);
        return user;
    }

    async resetPassword(token?: string, newPassword?: string) {
        if (!token || !newPassword) {
            throw new HttpError(400, "Token and new password are required");
        }

        // Validate password strength
        const validation = ResetPasswordDto.safeParse({ newPassword });
        if (!validation.success) {
            throw new HttpError(422, validation.error.issues[0].message);
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            const userId = decoded.id;
            const user = await this.userRepository.getUserById(userId);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await this.userRepository.updateUserById(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(400, "Invalid or expired token");
        }
    }


}

