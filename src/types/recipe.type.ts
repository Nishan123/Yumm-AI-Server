import { z } from "zod";
import { IngredientScheme } from "./ingredient.type";
import { kitchenToolsScheme } from "./kitchen-tool.type";

export const InstructionScheme = z.object({
    id: z.string().min(1, { error: "Instruction ID required" }),
    step: z.string().min(1, { error: "Instruction text required" }),
    isDone: z.boolean().default(false),
});

export const RecipeScheme = z.object({
    recipeId: z.string().min(1, { error: "Recipe ID required" }),
    generatedBy: z.string().min(1, { error: "User Id required" }),
    recipeName: z.string().min(1, { error: "Recipe name is required" }),
    ingredients: z.array(IngredientScheme).min(1, { error: "Ingredients required" }),
    steps: z.array(InstructionScheme).min(1, { error: "Steps Required" }),
    initialPreparation: z.array(InstructionScheme).min(1, { error: "Initial preparation steps required" }),
    kitchenTools: z.array(kitchenToolsScheme).min(1, { error: "Ktichen tools required" }),
    experienceLevel: z.enum(["newBie", "canCook", "expert"]),
    estCookingTime: z.string().min(1, { error: "Estimated time required" }),
    description: z.string().min(1, { error: "Description required" }),
    mealType: z.string().min(1, { error: "Meal type required" }),
    cuisine: z.string().min(1, { error: "Cuisine require" }),
    calorie: z.number().positive({ message: "Calorie must be > 0" }),
    images: z.array(z.string()).default([]), // Allow empty images initially
    nutrition: z.object({
        protein: z.number().optional(),
        carbs: z.number().optional(),
        fat: z.number().optional(),
        fiber: z.number().optional(),
    }).optional(),
    servings: z.number().int().positive(),
    likes: z.array(z.string()).default([]),
    dietaryRestrictions: z.array(z.string()).default([]),
    isPublic: z.boolean().default(true),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});

export type RecipeType = z.infer<typeof RecipeScheme>;
