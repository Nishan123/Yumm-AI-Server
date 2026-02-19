import { Router } from "express";
import { BugReportController } from "../controllers/bug-report.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

import { uploadBugReportImageMiddleware } from "../middlewares/bugReportImage.middleware";

const router = Router();
const bugReportController = new BugReportController();

router.post("/bug-report", authorizedMiddleWare, bugReportController.createReport);
router.post(
    "/bug-report/upload-screenshot",
    authorizedMiddleWare,
    uploadBugReportImageMiddleware.single("screenshot"),
    bugReportController.uploadScreenshot
);

export default router;
