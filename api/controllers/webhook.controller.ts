import { Request, Response } from "express";
import { webhookService } from "../services/webhook.service";

export class WebhookController {
    public async handleRevenueCatWebhook(req: Request, res: Response): Promise<void> {
        try {
            // Acknowledge receipt of the webhook to RevenueCat immediately
            res.status(200).send("Webhook received");

            // Process the webhook asynchronously
            await webhookService.processRevenueCatWebhook(req.body);
        } catch (error) {
            console.error("Error handling RevenueCat webhook:", error);
            // It's technically too late to change the response if already sent,
            // but the catch block prevents unhandled promise rejections.
        }
    }
}

export const webhookController = new WebhookController();
