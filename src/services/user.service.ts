import { UpdateUserDto } from "../dtos/user.dto";
import { IUserRepository, UserRepository } from "../repositories/user.repository";
import { UserType } from "../types/user.type";
import fs from "fs";
import path from "path";

export class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository = new UserRepository()) {
        this.userRepository = userRepository;
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
        const { uid, fullName, email, allergenicIngredients, authProvider, updatedAt, profilePic } = data;
        const updates: Partial<UserType> = {};
        if (fullName !== undefined) updates.fullName = fullName;
        if (email !== undefined) updates.email = email;
        if (allergenicIngredients !== undefined) updates.allergenicIngredients = allergenicIngredients;
        if (authProvider !== undefined) updates.authProvider = authProvider;
        if (updatedAt !== undefined) updates.updatedAt = updatedAt;
        if (profilePic !== undefined) updates.profilePic = profilePic;
        if (data.isSubscribedUser !== undefined) updates.isSubscribedUser = data.isSubscribedUser;

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

    async updateProfilePic(uid: string, file?: Express.Multer.File): Promise<String | null> {
        const existing = await this.userRepository.getUser(uid);
        if (!existing) {
            return null;
        }

        if (!file) {
            return existing.profilePic || null;
        }

        const port = process.env.PORT || 5000;
        const uploadDir = path.dirname(file.path);
        const ext = file.filename.split('.').pop();
        const newFilename = `pp-${uid}.${ext}`;
        const newPath = path.join(uploadDir, newFilename);

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

        // Use the actual filename from Multer
        const profilePicUrl = `http://localhost:${port}/public/profilePic/${file.filename}`;
        const result = await this.userRepository.updateProfilePic(uid, profilePicUrl);
        return result;
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
}
