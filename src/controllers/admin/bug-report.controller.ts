import { Request, Response } from "express";
import { AdminBugReportService } from "../../services/admin/admin-bug-report.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import { HttpError } from "../../errors/http-error";

interface QueryParams {
    page?: string;  
    size?: string;
    searchTerm?: string;
    status?: string;
}

export class AdminBugReportController {
    private adminBugReportService: AdminBugReportService;

    constructor(adminBugReportService: AdminBugReportService = new AdminBugReportService()) {
        this.adminBugReportService = adminBugReportService;
    }

    getAllReports = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, size, searchTerm, status }: QueryParams = req.query;
            const result = await this.adminBugReportService.getAllReports(page, size, searchTerm, status);
            sendSuccess(res, result, 200, "Bug reports fetched successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    getReportById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const report = await this.adminBugReportService.getReportById(id);
            sendSuccess(res, report, 200, "Bug report fetched successfully");
        } catch (error) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 500);
        }
    };

    updateStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const report = await this.adminBugReportService.updateStatus(id, status);
            sendSuccess(res, report, 200, "Bug report status updated successfully");
        } catch (error) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 500);
        }
    };

    resolveBug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const report = await this.adminBugReportService.resolveBug(id);
            sendSuccess(res, report, 200, "Bug report resolved successfully");
        } catch (error) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 500);
        }
    };

    deleteBugReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.adminBugReportService.deleteBugReport(id);
            sendSuccess(res, null, 200, "Bug report deleted successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    getUserBugReports = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.params; // Changed to email based on service update
            const reports = await this.adminBugReportService.getUserBugReports(email);
            sendSuccess(res, reports, 200, "User bug reports fetched successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}
