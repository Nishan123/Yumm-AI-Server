import { z } from "zod";
import { IngridentScheme } from "./ingrident.type";
import { kitchenToolsScheme } from "./kitchen-tool.type";

export const RecipeScheme = z.object({
    recipeId: z.string().min(1, { error: "Recipe ID required" }),
    generatedBy: z.string().min(1, { error: "User Id required" }),
    recipeName: z.string().min(1, { error: "Recipe name is required" }),
    ingridents: z.array(IngridentScheme).min(1, { error: "Ingridents required" }),
    steps: z.array(z.string()).min(1, { error: "Steps Required" }),
    initialPrepration: z.array(z.string()).min(1, { error: "Inital prepration steps required" }),
    kitchenTools: z.array(kitchenToolsScheme).min(1, { error: "Ktichen tools required" }),
    experienceLevel: z.enum(["newBie", "canCook", "expert"]),
    estCookingTime: z.string().min(1, { error: "Estimated time required" }),
    description: z.string().min(1, { error: "Description required" }),
    cusine: z.string().min(1, { error: "Cusine require" }),
    calorie: z.number().positive({ message: "Calorie must be > 0" }),
    images: z.array(z.string()).min(1, { error: "Images required" }),
    nutrition: z.object({
        protein: z.number().optional(),
        carbs: z.number().optional(),
        fat: z.number().optional(),
        fiber: z.number().optional(),
    }).optional(),
    servings: z.number().int().positive(),
    likes:z.array(z.string()).default([]),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});

export type RecipeType = z.infer<typeof RecipeScheme>;
