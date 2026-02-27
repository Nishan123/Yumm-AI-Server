import mongoose, { Document, Model, Schema } from "mongoose";
import { UserModel, IUser } from "../models/user.model";
import { DeletedUserModel } from "../models/deleted-user.model";
import { UserType } from "../types/user.type";
import { QueryFilter } from "mongoose";

export interface IUserRepository {
    createUser(newUser: UserType): Promise<IUser>;
    getUser(uid: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getAllUsers(): Promise<Array<IUser>>;
    getAllPaginatedUsers(page: number, size: number, searchTerm?: string): Promise<{ users: IUser[], total: number }>;
    updateUser(uid: string, updates: Partial<IUser>): Promise<IUser | null>;
    updateUserById(id: string, updates: Partial<IUser>): Promise<IUser | null>;
    updateProfilePic(uid: string, profilePicUrl: string): Promise<String | null>;
    deleteUser(uid: string, reason?: string): Promise<void>;
    deleteUserById(id: string, reason?: string): Promise<void>;
    getUsersWithPushyTokens(isSubscribed?: boolean): Promise<Array<string>>;
}


export class UserRepository implements IUserRepository {

    async getAllPaginatedUsers(page: number, size: number, searchTerm?: string)
        : Promise<{ users: IUser[]; total: number; }> {
        const filter: QueryFilter<IUser> = {};
        if (searchTerm) {
            filter.$or = [
                { fullName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        const [users, total] = await Promise.all([
            UserModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * size).limit(size),
            UserModel.countDocuments(filter)
        ]);
        return { users, total };
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const normalizedEmail = email.toLowerCase();
        const doc = await UserModel.findOne({ email: normalizedEmail }).exec();
        return doc ? doc : null;
    }
    async getAllUsers(): Promise<Array<IUser>> {
        const docs = await UserModel.find().exec();
        return docs.map((doc) => doc);
    }

    async createUser(newUser: UserType): Promise<IUser> {
        const created = await UserModel.create({
            ...newUser,
            email: newUser.email.toLowerCase(),
            role: newUser.role ?? "user",
        });
        return created;
    }

    async getUser(uid: string): Promise<IUser | null> {
        const doc = await UserModel.findOne({ uid }).exec();
        return doc ? doc : null;
    }

    async updateUser(uid: string, updates: Partial<IUser>): Promise<IUser | null> {
        const doc = await UserModel
            .findOneAndUpdate({ uid }, { $set: updates }, { new: true })
            .exec();
        return doc ? doc : null;
    }

    async deleteUser(uid: string, reason?: string): Promise<void> {
        const user = await UserModel.findOne({ uid }).exec();
        if (user) {
            await DeletedUserModel.create({
                uid: user.uid,
                email: user.email,
                fullName: user.fullName,
                authProvider: user.authProvider || "unknown",
                deletedReason: reason,
            });
            await UserModel.deleteOne({ uid }).exec();
        }
    }

    async updateProfilePic(uid: string, profilePicUrl: string): Promise<String | null> {
        const doc = await UserModel
            .findOneAndUpdate(
                { uid },
                { $set: { profilePic: profilePicUrl, updatedAt: new Date() } },
                { new: true }
            )
            .exec();
        return doc?.profilePic ? doc.profilePic : null;
    }

    // ID-based methods for admin operations
    async getUserById(id: string): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const doc = await UserModel.findById(id).exec();
        return doc ? doc : null;
    }

    async updateUserById(id: string, updates: Partial<IUser>): Promise<IUser | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const doc = await UserModel
            .findByIdAndUpdate(id, { $set: updates }, { new: true })
            .exec();
        return doc ? doc : null;
    }

    async deleteUserById(id: string, reason?: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return;
        }
        const user = await UserModel.findById(id).exec();
        if (user) {
            await DeletedUserModel.create({
                uid: user.uid,
                email: user.email,
                fullName: user.fullName,
                authProvider: user.authProvider || "unknown",
                deletedReason: reason,
            });
            await UserModel.findByIdAndDelete(id).exec();
        }
    }

    async getUsersWithPushyTokens(isSubscribed?: boolean): Promise<Array<string>> {
        const query: any = {
            pushyToken: { $exists: true, $nin: [null, ""] }
        };

        if (isSubscribed !== undefined) {
            query.isSubscribedUser = isSubscribed;
        }

        const users = await UserModel.find(query).select("pushyToken").exec();

        const tokens = users
            .map((u) => u.pushyToken)
            .filter((token): token is string => !!token);


        console.log(`[UserRepository] Found ${tokens.length} users with push tokens.`);
        return tokens;
    }
}