import { CreateUserDto } from "../../dtos/auth.dto";
import { IUserRepository, UserRepository } from "../../repositories/user.repository";
import { UserType } from "../../types/user.type";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../../errors/http-error";
import fs from "fs";
import path from "path";

export class AdminUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async createUser(payload: CreateUserDto, file?: Express.Multer.File): Promise<UserType> {
        const validatedData = CreateUserDto.parse(payload);
        const normalizedEmail = validatedData.email.toLowerCase();
        const uid = uuidv4();

        // Check if user already exists
        const existingByEmail = await this.userRepository.getUserByEmail(normalizedEmail);
        if (existingByEmail) {
            throw new HttpError(409, "User with this email already exists");
        }

        let profilePicUrl = payload.profilePic;
        if (file) {
            const port = process.env.PORT || 5000;
            const ext = file.filename.split('.').pop();
            const oldPath = file.path;
            const newFilename = `pp-${uid}.${ext}`;
            const newPath = path.join(path.dirname(oldPath), newFilename);
            try {
                if (fs.existsSync(newPath)) fs.unlinkSync(newPath); // optional
                fs.renameSync(oldPath, newPath);
                profilePicUrl = `http://localhost:${port}/public/profilePic/${newFilename}`;
            } catch (e) {
                console.error("Error renaming file", e);
            }
        }

        // Default pic
        const finalProfilePicUrl = profilePicUrl || "https://i.pinimg.com/1200x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg";

        // Hash password if provided
        let hashedPassword: string | undefined;
        if (validatedData.password) {
            hashedPassword = await bcryptjs.hash(validatedData.password, 10);
        }

        const userToCreate: UserType = {
            uid,
            fullName: validatedData.fullName,
            email: normalizedEmail,
            allergenicIngredients: validatedData.allergenicIngredients || [],
            authProvider: validatedData.authProvider,
            role: validatedData.role,
            profilePic: finalProfilePicUrl,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
            isSubscribedUser: false,
        };

        return this.userRepository.createUser(userToCreate);
    }

    async getAllUsers(): Promise<UserType[]> {
        return this.userRepository.getAllUsers();
    }

    async getUserById(id: string): Promise<UserType | null> {
        return this.userRepository.getUserById(id);
    }

    async updateUserById(id: string, updates: any, file?: Express.Multer.File): Promise<UserType | null> {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            return null;
        }

        let profilePicUrl = updates.profilePic;
        if (file) {
            const port = process.env.PORT || 5000;
            const ext = file.filename.split('.').pop();
            const oldPath = file.path;
            const newFilename = `pp-${existing.uid}.${ext}`;
            const newPath = path.join(path.dirname(oldPath), newFilename);
            try {
                if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
                fs.renameSync(oldPath, newPath);
                profilePicUrl = `http://localhost:${port}/public/profilePic/${newFilename}`;
            } catch (e) {
                console.error("Error renaming file", e);
            }
        }

        const payload: any = {
            ...updates,
            updatedAt: new Date(),
        };

        if (profilePicUrl) {
            payload.profilePic = profilePicUrl;
        }

        return this.userRepository.updateUserById(id, payload);
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
