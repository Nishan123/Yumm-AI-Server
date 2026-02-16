import { z } from "zod";
import { BugReportScheme } from "../types/bug-report.type";

export const CreateBugReportDto = BugReportScheme.pick({
    reportDescription: true,
    problemType: true,
    reportedBy: true,
    screenshotUrl: true,
});

export type CreateBugReportDto = z.infer<typeof CreateBugReportDto>;
