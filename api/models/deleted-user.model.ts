import mongoose, { Schema, Document } from "mongoose";

export interface IDeletedUser extends Document {
    uid: string;
    email: string;
    fullName: string;
    authProvider: string;
    deletedReason?: string;
    deletedAt: Date;
}

const deletedUserSchema = new Schema<IDeletedUser>({
    uid: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    authProvider: { type: String, required: true },
    deletedReason: { type: String, required: false },
    deletedAt: { type: Date, required: true, default: Date.now }
}, {
    timestamps: true
});

export const DeletedUserModel = mongoose.model<IDeletedUser>("DeletedUser", deletedUserSchema);
