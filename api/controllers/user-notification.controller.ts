import { Request, Response } from "express";
import { UserNotificationModel } from "../models/user-notification.model";

export class UserNotificationController {

    // Get notifications for a specific user
    async getUserNotifications(req: Request, res: Response) {
        try {
            const { uid } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            if (!uid) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const notifications = await UserNotificationModel.find({ userId: uid })
                .sort({ createdAt: -1 }) // Newest first
                .skip(skip)
                .limit(limit);

            const total = await UserNotificationModel.countDocuments({ userId: uid });

            return res.status(200).json({
                notifications,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error: any) {
            console.error("Error in getUserNotifications:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }

    // Mark a single notification as read
    async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const notification = await UserNotificationModel.findByIdAndUpdate(
                id,
                { isRead: true },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            }

            return res.status(200).json({ success: true, notification });
        } catch (error: any) {
            console.error("Error in markAsRead:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }

    // Mark all notifications for a user as read
    async markAllAsRead(req: Request, res: Response) {
        try {
            const { uid } = req.params;

            if (!uid) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const result = await UserNotificationModel.updateMany(
                { userId: uid, isRead: false },
                { $set: { isRead: true } }
            );

            return res.status(200).json({
                success: true,
                message: `${result.modifiedCount} notifications marked as read`
            });
        } catch (error: any) {
            console.error("Error in markAllAsRead:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }
}
