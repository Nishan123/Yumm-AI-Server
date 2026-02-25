import { UserModel } from "../models/user.model";

export class WebhookService {
    public async processRevenueCatWebhook(body: any): Promise<void> {
        if (!body || !body.event) {
            console.warn("Invalid webhook payload received");
            return;
        }

        const event = body.event;
        const appUserId = event.app_user_id;
        const eventType = event.type;

        if (!appUserId) {
            console.warn("Webhook event missing app_user_id");
            return;
        }

        let isSubscribed = false;

        // Determine subscription status based on the event type
        // Reference: https://www.revenuecat.com/docs/webhooks
        switch (eventType) {
            case "INITIAL_PURCHASE":
            case "RENEWAL":
            case "UNCANCELLATION":
            case "NON_RENEWING_PURCHASE":
            case "TRANSFER":
                isSubscribed = true;
                break;
            case "EXPIRATION":
            case "BILLING_ISSUE":
                isSubscribed = false;
                break;
            default:
                // For events like CANCELLATION, the user still retains access until the period ends (EXPIRATION).
                // Thus, no immediate status change is required.
                console.log(`Received ${eventType} event for user ${appUserId}. No status update needed.`);
                return;
        }

        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { uid: appUserId },
                { $set: { isSubscribedUser: isSubscribed } },
                { new: true }
            );

            if (updatedUser) {
                console.log(`Successfully updated subscription status for user ${appUserId}: ${isSubscribed}`);
            } else {
                console.warn(`User with uid ${appUserId} not found when processing webhook.`);
            }
        } catch (error) {
            console.error(`Error updating user status for webhook event:`, error);
        }
    }
}

export const webhookService = new WebhookService();
