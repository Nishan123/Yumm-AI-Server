import { BugReportRepository, IBugReportRepository } from "../../repositories/bug-report.repository";
import { IBugReport } from "../../models/bug-report.model";
import { HttpError } from "../../errors/http-error";

export class AdminBugReportService {
    private bugReportRepository: IBugReportRepository;

    constructor(bugReportRepository: IBugReportRepository = new BugReportRepository()) {
        this.bugReportRepository = bugReportRepository;
    }

    async getAllReports(page?: string, size?: string, searchTerm?: string, status?: string) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const pageSize = size ? parseInt(size, 10) : 10;

        const { bugReport, total } = await this.bugReportRepository.getAllReports(currentPage, pageSize, searchTerm, status);

        const pagination = {
            page: currentPage,
            size: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        };

        return { reports: bugReport, pagination };
    }

    async getReportById(bugId: string): Promise<IBugReport> {
        const report = await this.bugReportRepository.getReportById(bugId);
        if (!report) {
            throw new HttpError(404, "Bug report not found");
        }
        return report;
    }

    async updateStatus(bugId: string, status: string): Promise<IBugReport> {
        const report = await this.bugReportRepository.updateStatus(bugId, status);
        if (!report) {
            throw new HttpError(404, "Bug report not found");
        }
        return report;
    }

    async resolveBug(bugId: string): Promise<IBugReport> {
        const report = await this.bugReportRepository.resolveBug(bugId);
        if (!report) {
            throw new HttpError(404, "Bug report not found");
        }
        return report;
    }

    async deleteBugReport(bugId: string): Promise<void> {
        // Optionally check if exists before deleting, but deleteOne is idempotent-ish
        await this.bugReportRepository.deleteBugReport(bugId);
    }

    async getUserBugReports(email: string): Promise<IBugReport[]> {
        return this.bugReportRepository.getUsersBugReports(email);
    }
}
