import { Router } from "express";
import { AdminBugReportController } from "../../controllers/admin/bug-report.controller";
import { authorizedMiddleWare } from "../../middlewares/authorized.middleware";
import { isAdminMiddleware } from "../../middlewares/isAdmin.middleware";

const router = Router();
const adminBugReportController = new AdminBugReportController();

// All admin routes require authentication AND admin role
router.get(
    "/admin/bug-reports",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminBugReportController.getAllReports
);

router.get(
    "/admin/bug-reports/:id",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminBugReportController.getReportById
);

router.put(
    "/admin/bug-reports/:id/resolve",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminBugReportController.resolveBug
);

router.patch(
    "/admin/bug-reports/:id/status",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminBugReportController.updateStatus
);

router.delete(
    "/admin/bug-reports/:id",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminBugReportController.deleteBugReport
);

router.get(
    "/admin/bug-reports/user/:email",
    authorizedMiddleWare,
    isAdminMiddleware,
    adminBugReportController.getUserBugReports
);

export default router;
