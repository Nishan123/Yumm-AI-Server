import mongoose, { Document, Model, Schema } from "mongoose";
import { User } from "../types/user.type";

export interface IUserRepository {
    createUser(newUser: User): Promise<User>;
    getUser(uid: string): Promise<User | null>;
    getAllUsers():Promise<Array<User>>;
    updateUser(uid: string, updates: Partial<User>): Promise<User | null>;
    deleteUser(uid: string): Promise<void>;
}

// Mongo document shape for users
export interface UserDocument extends Document {
    uid: string;
    fullName: string;
    email: string;
    allergenicIngredients: string[];
    authProvider: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
    {
        uid: { type: String, required: true, unique: true, index: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        allergenicIngredients: { type: [String], default: [] },
        authProvider: { type: String, required: true },
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
    async getAllUsers(): Promise<Array<User>> {
        const docs = await this.model.find().exec();
        return docs.map((doc) => this.mapToUser(doc));
    }

    async createUser(newUser: User): Promise<User> {
        const created = await this.model.create(newUser);
        return this.mapToUser(created);
    }

    async getUser(uid: string): Promise<User | null> {
        const doc = await this.model.findOne({ uid }).exec();
        return doc ? this.mapToUser(doc) : null;
    }

    async updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
        const doc = await this.model
            .findOneAndUpdate({ uid }, { $set: updates }, { new: true })
            .exec();
        return doc ? this.mapToUser(doc) : null;
    }

    async deleteUser(uid: string): Promise<void> {
        await this.model.deleteOne({ uid }).exec();
    }

    private mapToUser(doc: UserDocument): User {
        return {
            uid: doc.uid,
            fullName: doc.fullName,
            email: doc.email,
            allergenicIngredients: doc.allergenicIngredients,
            authProvider: doc.authProvider,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}