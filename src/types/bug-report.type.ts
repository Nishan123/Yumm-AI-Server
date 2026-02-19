import { z } from "zod";

export const BugReportScheme = z.object({
    _id: z.any().optional(),
    reportId: z.string().min(1, { error: "Report Id required" }),
    reportedBy: z.string().min(1, { error: "Reporter required" }),
    screenshotUrl: z.string().optional().default(""),
    problemType: z.string().min(1, { error: "Problem type missing" }),
    reportDescription: z.string().min(1, { error: "Bug Report description required" }),
    isResolved: z.boolean().default(false),
    status: z.enum(['open', 'in-progress', 'resolved', 'closed']).default('open'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type BugReportType = z.infer<typeof BugReportScheme>;