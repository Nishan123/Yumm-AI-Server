import { z } from "zod";
import { BugReportScheme } from "../types/bug-report.type";

export const CreateBugReportDto = BugReportScheme.pick({
    reportDescription: true,
    problemType: true,
    reportedBy: true,
    screenshotUrl: true,
});

export type CreateBugReportDto = z.infer<typeof CreateBugReportDto>;

export const UpdateBugReportDto = BugReportScheme.pick({
    isResolved: true,
    status: true,
}).partial();

export type UpdateBugReportDto = z.infer<typeof UpdateBugReportDto>;
