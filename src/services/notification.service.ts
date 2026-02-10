import { PUSHY_SECRET_KEY } from "../config";

export class NotificationService {
    async sendPushNotification(tokens: string[], title: string, message: string): Promise<void> {
        console.log(`[NotificationService] Sending notification to ${tokens.length} devices.`);

        if (!tokens || tokens.length === 0) {
            console.log("[NotificationService] No tokens to send to.");
            return;
        }

        try {
            const response = await fetch(`https://api.pushy.me/push?api_key=${PUSHY_SECRET_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: tokens,
                    data: {
                        title,
                        message,
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
                return;
            }

            const responseData = await response.json();
            console.log("[NotificationService] Pushy API Success:", JSON.stringify(responseData));

        } catch (error) {
            console.error("Error sending push notification:", error);
            // We might not want to throw here to avoid failing the whole request just because notification failed
            // But for now, user asked for implementation.
        }
    }
}
