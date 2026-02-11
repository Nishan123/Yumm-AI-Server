import { UpdateUserDto } from "../dtos/user.dto";
import { IUserRepository, UserRepository } from "../repositories/user.repository";
import { UserType } from "../types/user.type";
import { HttpError } from "../errors/http-error";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../config";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import { NotificationService } from "./notification.service";

export class UserService {
    private userRepository: IUserRepository;
    private googleClient: OAuth2Client;
    private notificationService: NotificationService;

    constructor(
        userRepository: IUserRepository = new UserRepository(),
        notificationService: NotificationService = new NotificationService()
    ) {
        this.userRepository = userRepository;
        this.googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        this.notificationService = notificationService;
    }

    async getAllUsers(): Promise<Array<UserType>> {
        return this.userRepository.getAllUsers();
    }


    async getUser(uid: string): Promise<UserType | null> {
        return this.userRepository.getUser(uid);
    }

    async updateUser(payload: UpdateUserDto): Promise<UserType | null> {
        const data = UpdateUserDto.parse({ ...payload, updatedAt: new Date() });
        const existing = await this.userRepository.getUser(data.uid);
        if (!existing) {
            return null;
        }
        const { uid, fullName, email, allergenicIngredients, authProvider, updatedAt } = data;
        const updates: Partial<UserType> = {};
        if (fullName !== undefined) updates.fullName = fullName;
        if (email !== undefined) updates.email = email;
        if (allergenicIngredients !== undefined) updates.allergenicIngredients = allergenicIngredients;
        if (authProvider !== undefined) updates.authProvider = authProvider;
        if (updatedAt !== undefined) updates.updatedAt = updatedAt;
        if (data.isSubscribedUser !== undefined) updates.isSubscribedUser = data.isSubscribedUser;
        // NOTE: profilePic is NOT handled here. Use updateProfilePic() instead.

        return this.userRepository.updateUser(uid, updates);
    }

    async deleteUser(uid: string): Promise<boolean> {
        const existing = await this.userRepository.getUser(uid);
        if (!existing) {
            return false;
        }
        await this.userRepository.deleteUser(uid);
        return true;
    }

    async updateProfilePic(uid: string, file?: Express.Multer.File): Promise<UserType | null> {
        const existing = await this.userRepository.getUser(uid);
        if (!existing) {
            return null;
        }

        if (!file) {
            return existing;
        }

        const port = process.env.PORT || 5000;
        const uploadDir = path.dirname(file.path);

        // Delete old profile pics for this user (any extension)
        try {
            const files = fs.readdirSync(uploadDir);
            files.forEach((f) => {
                if (f.startsWith(`pp-${uid}.`) && f !== file.filename) {
                    try {
                        fs.unlinkSync(path.join(uploadDir, f));
                    } catch (err) {
                        throw new Error("Failed to delete old profile pic");
                    }
                }
            });
        } catch (error) {
            throw new Error("Failed to process profile picture");
        }

        // Save the URL to the user's profilePic field in the database
        const profilePicUrl = `http://localhost:${port}/public/profilePic/${file.filename}`;
        await this.userRepository.updateProfilePic(uid, profilePicUrl);

        // Return the full updated user so the frontend gets all fields
        return this.userRepository.getUser(uid);
    }

    // Admin operations
    async createUser(userData: UserType): Promise<UserType> {
        return this.userRepository.createUser(userData);
    }

    async getUserById(id: string): Promise<UserType | null> {
        return this.userRepository.getUserById(id);
    }

    async getUserByEmail(email: string): Promise<UserType | null> {
        return this.userRepository.getUserByEmail(email);
    }

    async updateUserById(id: string, updates: any): Promise<UserType | null> {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            return null;
        }
        return this.userRepository.updateUserById(id, updates);
    }

    async deleteUserById(id: string): Promise<boolean> {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            return false;
        }
        await this.userRepository.deleteUserById(id);
        return true;
    }

    /**
     * Delete user with password verification (for emailPassword auth users)
     */
    async deleteUserWithPassword(uid: string, password: string): Promise<boolean> {
        const existing = await this.userRepository.getUser(uid);
        if (!existing) {
            throw new HttpError(404, "User not found");
        }

        // Check if user is using emailPassword auth
        if (existing.authProvider !== "emailPassword") {
            throw new HttpError(400, "This account uses Google Sign-In. Please verify with Google.");
        }

        // Verify password
        if (!existing.password) {
            throw new HttpError(400, "No password set for this account");
        }

        const validPassword = await bcryptjs.compare(password, existing.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid password");
        }

        // Delete the user
        await this.userRepository.deleteUser(uid);
        return true;
    }

    /**
     * Delete user with Google token verification (for Google auth users)
     */
    async deleteUserWithGoogle(uid: string, idToken: string): Promise<boolean> {
        const existing = await this.userRepository.getUser(uid);
        if (!existing) {
            throw new HttpError(404, "User not found");
        }

        // Check if user is using Google auth
        if (existing.authProvider !== "google") {
            throw new HttpError(400, "This account uses email/password. Please verify with password.");
        }

        // Verify Google ID token
        let googlePayload;
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: idToken,
                audience: GOOGLE_CLIENT_ID,
            });
            googlePayload = ticket.getPayload();
        } catch (error) {
            throw new HttpError(401, "Invalid Google token");
        }

        if (!googlePayload || !googlePayload.email) {
            throw new HttpError(401, "Invalid Google token payload");
        }

        // Verify the email matches
        const tokenEmail = googlePayload.email.toLowerCase();
        if (tokenEmail !== existing.email.toLowerCase()) {
            throw new HttpError(401, "Google account email does not match");
        }


        // Delete the user
        await this.userRepository.deleteUser(uid);
        return true;
    }
    async registerPushyToken(uid: string, token: string): Promise<UserType | null> {
        console.log(`[UserService] Registering push token for user ${uid}: ${token}`);
        return this.userRepository.updateUser(uid, { pushyToken: token });
    }

    async sendAdminNotification(title: string, message: string): Promise<void> {
        const tokens = await this.userRepository.getUsersWithPushyTokens();
        await this.notificationService.sendPushNotification(tokens, title, message);
    }
}
