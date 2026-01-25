import mongoose, { Document, Model, Schema } from "mongoose";
import { UserModel, IUser } from "../model/user.model";
import { UserType } from "../types/user.type";

export interface IUserRepository {
    createUser(newUser: UserType): Promise<IUser>;
    getUser(uid: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getAllUsers(): Promise<Array<IUser>>;
    updateUser(uid: string, updates: Partial<IUser>): Promise<IUser | null>;
    updateProfilePic(uid: string, profilePicUrl: string): Promise<String | null>;
    deleteUser(uid: string): Promise<void>;
}


export class UserRepository implements IUserRepository {

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

    async deleteUser(uid: string): Promise<void> {
        await UserModel.deleteOne({ uid }).exec();
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
}