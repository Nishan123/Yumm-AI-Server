
import express from "express";
import { getStats } from "../../controllers/admin/dashboard.controller";
import { authorizedMiddleWare } from "../../middlewares/authorized.middleware";
import { isAdminMiddleware } from "../../middlewares/isAdmin.middleware";

const router = express.Router();

router.get("/stats", authorizedMiddleWare, isAdminMiddleware, getStats);

export { router as dashboardRoutes };
