import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { JWT_SECRET, GOOGLE_CLIENT_ID } from "../config";
import { RegisterDto, LoginDto, GoogleAuthDto } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";
import { IUserRepository, UserRepository } from "../respositories/user.repository";
import { UserType } from "../types/user.type";
import { v4 as uuidv4 } from "uuid";

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
}
