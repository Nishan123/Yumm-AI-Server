import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const UserScheme: Schema = new Schema(
    {
        uid: { type: String, required: true, unique: true, index: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
        allergenicIngredients: { type: [String], default: [] },
        authProvider: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export const UserModel = mongoose.model<IUser>("User", UserScheme);