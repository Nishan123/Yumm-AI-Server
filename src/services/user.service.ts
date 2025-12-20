import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { IUserRepository, UserRepository } from "../respositories/user.repository";
import { User } from "../types/user.type";

export class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository = new UserRepository()) {
        this.userRepository = userRepository;
    }

    async getAllUsers(): Promise<Array<User>> {
        return this.userRepository.getAllUsers();
    }

    async createUser(payload: CreateUserDto): Promise<User> {
        const data = CreateUserDto.parse(payload);
        const existing = await this.userRepository.getUser(data.uid);
        if (existing) {
            throw new Error("User already exists");
        }
        return this.userRepository.createUser(data);
    }

    async getUser(uid: string): Promise<User | null> {
        return this.userRepository.getUser(uid);
    }

    async updateUser(payload: UpdateUserDto): Promise<User | null> {
        const data = UpdateUserDto.parse({ ...payload, updatedAt: new Date() });
        const existing = await this.userRepository.getUser(data.uid);
        if (!existing) {
            return null;
        }
        const { uid, fullName, email, allergenicIngredients, authProvider, updatedAt } = data;
        const updates: Partial<User> = {};
        if (fullName !== undefined) updates.fullName = fullName;
        if (email !== undefined) updates.email = email;
        if (allergenicIngredients !== undefined) updates.allergenicIngredients = allergenicIngredients;
        if (authProvider !== undefined) updates.authProvider = authProvider;
        if (updatedAt !== undefined) updates.updatedAt = updatedAt;

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
}
