import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const UserScheme: Schema = new Schema(
    {
        uid: { type: String, required: true, unique: true, index: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
        profilePic: { type: String, default: "https://i.pinimg.com/1200x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg" },
        allergenicIngredients: { type: [String], default: [] },
        authProvider: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        isSubscribedUser: { type: Boolean, default: false },
        password: { type: String },
        pushyToken: { type: String }
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