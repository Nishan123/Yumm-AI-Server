import mongoose, { Document, Model, Schema } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUserRepository {
    createUser(newUser: UserType): Promise<UserType>;
    getUser(uid: string): Promise<UserType | null>;
    getUserByEmail(email: String): Promise<UserType|null>;
    getAllUsers():Promise<Array<UserType>>;
    updateUser(uid: string, updates: Partial<UserType>): Promise<UserType | null>;
    deleteUser(uid: string): Promise<void>;
}

// Mongo document shape for users
export interface UserDocument extends Document {
    uid: string;
    fullName: string;
    email: string;
    allergenicIngredients: string[];
    authProvider: string;
    password: string;
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
    async getUserByEmail(email: String): Promise<UserType | null> {
        const doc = await this.model.findOne({email}).exec();
        return doc? this.mapToUser(doc):null;

    }
    async getAllUsers(): Promise<Array<UserType>> {
        const docs = await this.model.find().exec();
        return docs.map((doc) => this.mapToUser(doc));
    }

    async createUser(newUser: UserType): Promise<UserType> {
        const created = await this.model.create(newUser);
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
            allergenicIngredients: doc.allergenicIngredients,
            authProvider: doc.authProvider,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            password: doc.password
        };
    }
}