import mongoose, { Document, Schema } from "mongoose";
import { NotificationType, NotificationTargetAudience } from "../types/notification.type";

export interface INotification extends NotificationType, Document {
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        targetAudience: {
            type: String,
            enum: Object.values(NotificationTargetAudience),
            default: NotificationTargetAudience.ALL
        },
        sentCount: { type: Number, default: 0 },
        failureCount: { type: Number, default: 0 },
        status: { type: String, enum: ["success", "failed", "partial"], default: "success" },
    },
    {
        timestamps: true,
    }
);

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
