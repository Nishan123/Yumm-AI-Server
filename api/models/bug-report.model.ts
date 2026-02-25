import mongoose, { Document, Schema } from "mongoose";
import { BugReportType } from "../types/bug-report.type";

const BugReportSchema: Schema = new Schema(
    {
        reportId: { type: String, required: true, unique: true },
        reportedBy: { type: String, required: true },
        screenshotUrl: { type: String, required: false, default: "" },
        problemType: { type: String, required: true },
        reportDescription: { type: String, required: true },
        isResolved: { type: Boolean, default: false },
        status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' }
    },
    {
        timestamps: true,
    }
);

export interface IBugReport extends Omit<BugReportType, '_id'>, Document {
    createdAt: Date;
    updatedAt: Date;
}

export const BugReportModel = mongoose.model<IBugReport>("BugReport", BugReportSchema);