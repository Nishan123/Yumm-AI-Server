import { Router } from "express";
import { webhookController } from "../controllers/webhook.controller";

const router = Router();

// Endpoint: POST /api/webhooks/revenuecat
router.post("/revenuecat", webhookController.handleRevenueCatWebhook);

export default router;
