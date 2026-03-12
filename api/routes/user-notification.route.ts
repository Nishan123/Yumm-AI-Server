import { Router } from "express";
import { UserNotificationController } from "../controllers/user-notification.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const controller = new UserNotificationController();

// All notification routes require authentication
router.get("/user-notifications/:uid", authorizedMiddleWare, controller.getUserNotifications);
router.patch("/user-notifications/:id/read", authorizedMiddleWare, controller.markAsRead);
router.patch("/user-notifications/:uid/read-all", authorizedMiddleWare, controller.markAllAsRead);

export default router;
