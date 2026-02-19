import { Request, Response } from "express";
import { BugReportService } from "../services/bug-report.service";
import { CreateBugReportDto } from "../dtos/bug-report.dto";
import { sendSuccess, sendError } from "../utils/response.util";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error";

export class BugReportController {
    private bugReportService: BugReportService;

    constructor(bugReportService: BugReportService = new BugReportService()) {
        this.bugReportService = bugReportService;
    }

    createReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: CreateBugReportDto = req.body;
            const report = await this.bugReportService.createReport(payload);
            sendSuccess(res, report, 201, "Bug report created successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                sendError(res, "Validation failed", 422, error.issues);
                return;
            }
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 400);
        }
    };

    uploadScreenshot = async (req: Request, res: Response): Promise<void> => {
        try {
            const file = req.file;
            if (!file) {
                sendError(res, "No screenshot uploaded", 400);
                return;
            }

            const imageUrl = `http://localhost:${process.env.PORT || 5000}/public/bugReportImages/${file.filename}`;
            sendSuccess(res, { imageUrl }, 200, "Screenshot uploaded successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}
