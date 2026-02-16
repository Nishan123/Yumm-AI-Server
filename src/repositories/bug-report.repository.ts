import { BugReportModel, IBugReport } from "../models/bug-report.model";
import { BugReportType } from "../types/bug-report.type";
import { UserModel } from "../models/user.model";
import { QueryFilter } from "mongoose";

export interface IBugReportRepository {
    createAReport(bugReport: BugReportType): Promise<IBugReport>;
    resolveBug(bugId: string): Promise<IBugReport | null>;
    getAllReports(page: number, size: number, searchTerm?: string): Promise<{ bugReport: IBugReport[], total: number }>;
    deleteBugReport(bugId: string): Promise<void>;
    getUsersBugReports(email: string): Promise<Array<IBugReport>>;
}

export class BugReportRepository implements IBugReportRepository {
    async createAReport(bugReport: BugReportType): Promise<IBugReport> {
        const report = await BugReportModel.create(bugReport);
        return report;
    }

    async resolveBug(bugId: string): Promise<IBugReport | null> {
        const report = await BugReportModel.findOneAndUpdate(
            { reportId: bugId },
            { isResolved: true },
            { new: true }
        ).exec();
        return report;
    }

    async getAllReports(page: number, size: number, searchTerm?: string): Promise<{ bugReport: IBugReport[]; total: number; }> {
        const filter: QueryFilter<IBugReport> = {};
        if (searchTerm) {
            filter.$or = [
                { reportDescription: { $regex: searchTerm, $options: 'i' } },
                { problemType: { $regex: searchTerm, $options: 'i' } },
                { reportId: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const [bugReport, total] = await Promise.all([
            BugReportModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * size)
                .limit(size)
                .exec(),
            BugReportModel.countDocuments(filter).exec()
        ]);

        return { bugReport, total };
    }

    async deleteBugReport(bugId: string): Promise<void> {
        await BugReportModel.deleteOne({ reportId: bugId }).exec();
    }

    async getUsersBugReports(email: string): Promise<Array<IBugReport>> {
        const reports = await BugReportModel.find({ reportedBy: email })
            .sort({ createdAt: -1 })
            .exec();
        return reports;
    }
}