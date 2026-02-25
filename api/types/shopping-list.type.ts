import { z } from "zod";

export const ShoppingListItemScheme = z.object({
    _id: z.any().optional(),
    itemId: z.string().min(1, { message: "Item Id required" }),
    userId: z.string().min(1, { message: "User Id required" }),
    quantity: z.string().min(1, { message: "Quantity required" }),
    unit: z.string().min(1, { message: "Unit required" }),
    category: z.string().optional().default("none"),
    isChecked: z.boolean().default(false),
    ingredientId: z.string().optional().default(""),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type ShoppingListItemType = z.infer<typeof ShoppingListItemScheme>;
