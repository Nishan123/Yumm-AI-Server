import { PUSHY_SECRET_KEY } from "../config";
import { SendNotificationDto } from "../dtos/notification.dto";
import { NotificationRepository } from "../repositories/notification.repo";
import { UserRepository } from "../repositories/user.repository";
import { NotificationTargetAudience } from "../types/notification.type";
import { UserNotificationModel } from "../models/user-notification.model";

export class NotificationService {
    private notificationRepo: NotificationRepository;
    private userRepo: UserRepository;

    constructor() {
        this.notificationRepo = new NotificationRepository();
        this.userRepo = new UserRepository();
    }

    async sendPushNotification(dto: SendNotificationDto): Promise<void> {
        const { title, message, targetAudience } = dto;
        console.log(`[NotificationService] Preparing to send notification: ${title} to ${targetAudience}`);

        let isSubscribed: boolean | undefined = undefined;
        if (targetAudience === NotificationTargetAudience.SUBSCRIBED) {
            isSubscribed = true;
        } else if (targetAudience === NotificationTargetAudience.UNSUBSCRIBED) {
            isSubscribed = false;
        }

        const targetUsers = await this.userRepo.getUsersForNotification(isSubscribed);

        if (!targetUsers || targetUsers.length === 0) {
            console.log("[NotificationService] No users to send to.");
            await this.notificationRepo.createLog({
                title,
                message,
                targetAudience,
                sentCount: 0,
                failureCount: 0,
                status: "failed",
            });
            return;
        }

        // 1. Insert in-app notifications
        const userNotifications = targetUsers.map(user => ({
            userId: user.uid,
            title,
            message,
            isRead: false
        }));

        try {
            await UserNotificationModel.insertMany(userNotifications);
            console.log(`[NotificationService] Inserted ${userNotifications.length} in-app notifications`);
        } catch (error) {
            console.error("[NotificationService] Error inserting in-app notifications:", error);
        }

        // 2. Filter users with push tokens to send actual push notifications
        const tokens = targetUsers
            .map(u => u.pushyToken)
            .filter((token): token is string => !!token && token.trim() !== "");

        if (tokens.length === 0) {
            console.log("[NotificationService] No tokens to send push notifications to.");
            await this.notificationRepo.createLog({
                title,
                message,
                targetAudience,
                sentCount: 0,
                failureCount: 0,
                status: "success", // Considered success since in-app got created
            });
            return;
        }

        try {
            const response = await fetch(`https://api.pushy.me/push?api_key=${PUSHY_SECRET_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: tokens,
                    data: {
                        title: title,
                        message: message,
                    },
                    notification: {
                        body: message,
                        title: title,
                        badge: 1,
                        sound: "ping.aiff"
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[NotificationService] Pushy API Error: ${response.status} ${response.statusText} - ${errorText}`);

                await this.notificationRepo.createLog({
                    title,
                    message,
                    targetAudience,
                    sentCount: 0,
                    failureCount: tokens.length,
                    status: "failed",
                });
                return;
            }

            const responseData = await response.json();
            console.log("[NotificationService] Pushy API Success:", JSON.stringify(responseData));
            await this.notificationRepo.createLog({
                title,
                message,
                targetAudience,
                sentCount: tokens.length,
                failureCount: 0,
                status: "success",
            });

        } catch (error) {
            console.error("Error sending push notification:", error);
            await this.notificationRepo.createLog({
                title,
                message,
                targetAudience,
                sentCount: 0,
                failureCount: tokens.length,
                status: "failed",
            });
        }
    }

    async getNotificationLogs(page: number, limit: number) {
        return await this.notificationRepo.getLogs(page, limit);
    }

    async deleteNotificationLog(id: string): Promise<boolean> {
        return await this.notificationRepo.deleteLog(id);
    }
}
