import { z } from "zod";

export const BugReportScheme = z.object({
    reportId: z.string().min(1, { error: "Report Id required" }),
    reportedBy: z.email(),
    screenshotUrl: z.string().min(1, { error: "Screenshot Url required" }),
    problemType: z.string().min(1, { error: "Problem type missing" }),
    reportDescription: z.string().min(1, { error: "Bug Report description required" }),
    isResolved: z.boolean()
});

export type BugReportType = z.infer<typeof BugReportScheme>;