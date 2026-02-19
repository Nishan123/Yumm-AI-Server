import { BugReportModel, IBugReport } from "../models/bug-report.model";
import { BugReportType } from "../types/bug-report.type";
import { UserModel } from "../models/user.model";
import { QueryFilter } from "mongoose";

export interface IBugReportRepository {
    createAReport(bugReport: BugReportType): Promise<IBugReport>;
    resolveBug(bugId: string): Promise<IBugReport | null>;
    getAllReports(page: number, size: number, searchTerm?: string, status?: string): Promise<{ bugReport: IBugReport[], total: number }>;
    deleteBugReport(bugId: string): Promise<void>;
    getUsersBugReports(email: string): Promise<Array<IBugReport>>;
    getReportById(bugId: string): Promise<IBugReport | null>;
    updateStatus(bugId: string, status: string): Promise<IBugReport | null>;
}

export class BugReportRepository implements IBugReportRepository {
    async createAReport(bugReport: BugReportType): Promise<IBugReport> {
        const report = await BugReportModel.create(bugReport);
        return report;
    }

    async resolveBug(bugId: string): Promise<IBugReport | null> {
        const report = await BugReportModel.findOneAndUpdate(
            { _id: bugId },
            { isResolved: true, status: 'resolved' },
            { new: true }
        ).exec();
        return report;
    }

    async getAllReports(page: number, size: number, searchTerm?: string, status?: string): Promise<{ bugReport: IBugReport[]; total: number; }> {
        const filter: QueryFilter<IBugReport> = {};
        if (searchTerm) {
            filter.$or = [
                { reportDescription: { $regex: searchTerm, $options: 'i' } },
                { problemType: { $regex: searchTerm, $options: 'i' } },
                { reportId: { $regex: searchTerm, $options: 'i' } },
                { reportedBy: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (status) {
            filter.status = status;
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
        await BugReportModel.deleteOne({ _id: bugId }).exec();
    }

    async getUsersBugReports(email: string): Promise<Array<IBugReport>> {
        const reports = await BugReportModel.find({ reportedBy: email })
            .sort({ createdAt: -1 })
            .exec();
        return reports;
    }

    async getReportById(bugId: string): Promise<IBugReport | null> {
        return BugReportModel.findOne({ _id: bugId }).exec();
    }

    async updateStatus(bugId: string, status: string): Promise<IBugReport | null> {
        const isResolved = status === 'resolved' || status === 'closed';

        return BugReportModel.findOneAndUpdate(
            { _id: bugId },
            { status: status, isResolved: isResolved },
            { new: true }
        ).exec();
    }
}