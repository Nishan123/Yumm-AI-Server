import mongoose, { Document, Schema } from "mongoose";
import { BugReportType } from "../types/bug-report.type";

const BugReportSchema: Schema = new Schema(
    {
        reportId: { type: String, required: true, unique: true },
        reportedBy: { type: String, required: true },
        screenshotUrl: { type: String, required: true },
        problemType: { type: String, required: true },
        reportDescription: { type: String, required: true },
        isResolved: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

export interface IBugReport extends BugReportType, Document { }

export const BugReportModel = mongoose.model<IBugReport>("BugReport", BugReportSchema);