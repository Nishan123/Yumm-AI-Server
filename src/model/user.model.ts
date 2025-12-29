import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";
import { email } from "zod";

const UserScheme: Schema = new Schema(
    {
        uid: { type: String },
        fullName: { type: String },
        email: { type: String, unique: true },
        allergenicIngredients: { type: Array },
        authProvider: { type: String },
        password: { type: String },


    }, {
    timestamps: true
}
);
export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export const UserModel = mongoose.model<IUser>("User", UserScheme);