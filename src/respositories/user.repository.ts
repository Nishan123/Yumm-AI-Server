import mongoose, { Document, Model, Schema } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUserRepository {
    createUser(newUser: UserType): Promise<UserType>;
    getUser(uid: string): Promise<UserType | null>;
    getUserByEmail(email: string): Promise<UserType | null>;
    getAllUsers(): Promise<Array<UserType>>;
    updateUser(uid: string, updates: Partial<UserType>): Promise<UserType | null>;
    deleteUser(uid: string): Promise<void>;
}

// Mongo document shape for users
export interface UserDocument extends Document {
    uid: string;
    fullName: string;
    email: string;
    profilePic: string;
    allergenicIngredients: string[];
    authProvider: string;
    role: "admin" | "user";
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
    {
        uid: { type: String, required: true, unique: true, index: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
        profilePic: { type: String, required: true },
        allergenicIngredients: { type: [String], default: [] },
        authProvider: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const UserModel: Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export class UserRepository implements IUserRepository {
    private model: Model<UserDocument>;

    constructor(model: Model<UserDocument> = UserModel) {
        this.model = model;
    }
    async getUserByEmail(email: string): Promise<UserType | null> {
        const normalizedEmail = email.toLowerCase();
        const doc = await this.model.findOne({ email: normalizedEmail }).exec();
        return doc ? this.mapToUser(doc) : null;
    }
    async getAllUsers(): Promise<Array<UserType>> {
        const docs = await this.model.find().exec();
        return docs.map((doc) => this.mapToUser(doc));
    }

    async createUser(newUser: UserType): Promise<UserType> {
        const created = await this.model.create({
            ...newUser,
            email: newUser.email.toLowerCase(),
            role: newUser.role ?? "user",
        });
        return this.mapToUser(created);
    }

    async getUser(uid: string): Promise<UserType | null> {
        const doc = await this.model.findOne({ uid }).exec();
        return doc ? this.mapToUser(doc) : null;
    }

    async updateUser(uid: string, updates: Partial<UserType>): Promise<UserType | null> {
        const doc = await this.model
            .findOneAndUpdate({ uid }, { $set: updates }, { new: true })
            .exec();
        return doc ? this.mapToUser(doc) : null;
    }

    async deleteUser(uid: string): Promise<void> {
        await this.model.deleteOne({ uid }).exec();
    }

    private mapToUser(doc: UserDocument): UserType {
        return {
            uid: doc.uid,
            fullName: doc.fullName,
            email: doc.email,
            profilePic: doc.profilePic,
            allergenicIngredients: doc.allergenicIngredients,
            authProvider: doc.authProvider,
            role: doc.role,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            password: doc.password
        };
    }
}