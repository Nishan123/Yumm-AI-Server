import { z } from "zod";

export const kitchenToolsScheme = z.object({
    toolId: z.string().min(1, { error: "Kitchen toolId required" }),
    toolName: z.string().min(1, { error: "Kitchen tool name required" }),
    imageUrl: z.string().min(1, { error: "Kitchen tool image url" })
});

export type kitchenToolsType = z.infer<typeof kitchenToolsScheme>;