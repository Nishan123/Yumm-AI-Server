import { PUSHY_SECRET_KEY } from "../config";
import { SendNotificationDto } from "../dtos/notification.dto";
import { NotificationRepository } from "../repositories/notification.repo";
import { UserRepository } from "../repositories/user.repository";
import { NotificationTargetAudience } from "../types/notification.type";

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

        const tokens = await this.userRepo.getUsersWithPushyTokens(isSubscribed);

        if (!tokens || tokens.length === 0) {
            console.log("[NotificationService] No tokens to send to.");
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
