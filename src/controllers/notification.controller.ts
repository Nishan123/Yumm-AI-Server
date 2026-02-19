import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { NotificationTargetAudience } from "../types/notification.type";

const notificationService = new NotificationService();

export class NotificationController {

    async sendNotification(req: Request, res: Response) {
        try {
            const { title, message, targetAudience } = req.body;

            if (!title || !message) {
                return res.status(400).json({ message: "Title and message are required" });
            }

            await notificationService.sendPushNotification({
                title,
                message,
                targetAudience: targetAudience || NotificationTargetAudience.ALL
            });

            return res.status(200).json({ success: true, message: "Notification process started" });
        } catch (error: any) {
            console.error("Error in sendNotification controller:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }

    async getLogs(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const logs = await notificationService.getNotificationLogs(page, limit);
            return res.status(200).json(logs);
        } catch (error: any) {
            console.error("Error in getLogs controller:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }

    async deleteLog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const success = await notificationService.deleteNotificationLog(id);

            if (!success) {
                return res.status(404).json({ message: "Notification log not found" });
            }

            return res.status(200).json({ success: true, message: "Notification log deleted successfully" });
        } catch (error: any) {
            console.error("Error in deleteLog controller:", error);
            return res.status(500).json({ message: error.message || "Internal server error" });
        }
    }
}
