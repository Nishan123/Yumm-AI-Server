import { CreateUserDto } from "../../dtos/auth.dto";
import { IUserRepository, UserRepository } from "../../respositories/user.repository";
import { UserType } from "../../types/user.type";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../../errors/http-error";

export class AdminUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async createUser(payload: CreateUserDto, profilePicUrl: string, uid: string = uuidv4()): Promise<UserType> {
        const validatedData = CreateUserDto.parse(payload);
        const normalizedEmail = validatedData.email.toLowerCase();

        // Check if user already exists
        const existingByEmail = await this.userRepository.getUserByEmail(normalizedEmail);
        if (existingByEmail) {
            throw new HttpError(409, "User with this email already exists");
        }

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
            profilePic: profilePicUrl,
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

    async updateUserById(id: string, updates: any, profilePicUrl?: string): Promise<UserType | null> {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            return null;
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
