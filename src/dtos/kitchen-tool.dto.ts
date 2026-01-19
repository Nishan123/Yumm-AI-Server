import { z } from "zod";
import { kitchenToolsScheme } from "../types/kitchen-tool.type";

// Create Kitchen Tool DTO
export const CreateKitchenToolDto = kitchenToolsScheme.omit({
    toolId: true,
});
export type CreateKitchenToolDto = z.infer<typeof CreateKitchenToolDto>;

// Update Kitchen Tool DTO
export const UpdateKitchenToolDto = kitchenToolsScheme.pick({
    toolId: true,
}).extend({
    toolName: kitchenToolsScheme.shape.toolName.optional(),
    imageUrl: kitchenToolsScheme.shape.imageUrl.optional(),
});
export type UpdateKitchenToolDto = z.infer<typeof UpdateKitchenToolDto>;
