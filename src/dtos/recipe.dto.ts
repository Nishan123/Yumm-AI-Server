import { z } from "zod";
import { RecipeScheme } from "../types/recipe.type";

// Create Recipe DTO - omit auto-generated fields
export const CreateRecipeDto = RecipeScheme.omit({
    recipeId: true,
    createdAt: true,
    updatedAt: true,
    likes: true,
});
export type CreateRecipeDto = z.infer<typeof CreateRecipeDto>;

// Update Recipe DTO - recipeId required, other fields optional
export const UpdateRecipeDto = RecipeScheme.pick({
    recipeId: true,
}).extend({
    recipeName: RecipeScheme.shape.recipeName.optional(),
    ingridents: RecipeScheme.shape.ingridents.optional(),
    steps: RecipeScheme.shape.steps.optional(),
    initialPrepration: RecipeScheme.shape.initialPrepration.optional(),
    kitchenTools: RecipeScheme.shape.kitchenTools.optional(),
    experienceLevel: RecipeScheme.shape.experienceLevel.optional(),
    estCookingTime: RecipeScheme.shape.estCookingTime.optional(),
    description: RecipeScheme.shape.description.optional(),
    cusine: RecipeScheme.shape.cusine.optional(),
    calorie: RecipeScheme.shape.calorie.optional(),
    images: RecipeScheme.shape.images.optional(),
    nutrition: RecipeScheme.shape.nutrition.optional(),
    servings: RecipeScheme.shape.servings.optional(),
});
export type UpdateRecipeDto = z.infer<typeof UpdateRecipeDto>;

// Like/Unlike Recipe DTO
export const LikeRecipeDto = z.object({
    recipeId: z.string().min(1, { error: "Recipe ID required" }),
    userId: z.string().min(1, { error: "User ID required" }),
});
export type LikeRecipeDto = z.infer<typeof LikeRecipeDto>;

// Get Recipes by User DTO
export const GetRecipesByUserDto = z.object({
    userId: z.string().min(1, { error: "User ID required" }),
});
export type GetRecipesByUserDto = z.infer<typeof GetRecipesByUserDto>;
