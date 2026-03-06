import mongoose, { Document, Schema } from "mongoose";

export interface IUserNotification extends Document {
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserNotificationScheme: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

export const UserNotificationModel = mongoose.model<IUserNotification>("UserNotification", UserNotificationScheme);
