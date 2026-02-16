import { Router } from "express";
import { BugReportController } from "../controllers/bug-report.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const bugReportController = new BugReportController();

router.post("/bug-report", authorizedMiddleWare, bugReportController.createReport);

export default router;
