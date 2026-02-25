import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
// You might want to add authentication middleware here if needed
// import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const notificationController = new NotificationController();

router.post("/notifications/send", notificationController.sendNotification);
router.get("/notifications/logs", notificationController.getLogs);
router.delete("/notifications/logs/:id", notificationController.deleteLog);

export default router;
