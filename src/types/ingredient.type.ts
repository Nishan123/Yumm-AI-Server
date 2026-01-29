import { z } from "zod";

export const IngredientScheme = z.object({
    ingredientId: z.string().min(1, { error: "Ingredient ID required" }),
    name: z.string().min(1, { error: "Ingredient name required" }),
    imageUrl: z.string().optional().default(""),  // Made optional to allow staple ingredients without images
    quantity: z.string().min(1, { error: "Quantity required" }),
    unit: z.string().optional().default("")  // Allow empty for staples like Salt, Pepper ("to taste")
});

export type IngredientType = z.infer<typeof IngredientScheme>;