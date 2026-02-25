import { z } from "zod";

export enum NotificationTargetAudience {
    ALL = "all",
    SUBSCRIBED = "subscribed",
    UNSUBSCRIBED = "unsubscribed",
}

export const NotificationSchema = z.object({
    title: z.string().min(1),
    message: z.string().min(1),
    targetAudience: z.nativeEnum(NotificationTargetAudience).default(NotificationTargetAudience.ALL),
    sentCount: z.number().default(0),
    failureCount: z.number().default(0),
    status: z.enum(["success", "failed", "partial"]).default("success"),
    createdAt: z.date().optional(),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
