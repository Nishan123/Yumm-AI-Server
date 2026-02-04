import { z } from "zod";
import { IngredientScheme } from "../types/ingredient.type";

// Create Ingredient DTO
export const CreateIngredientDto = IngredientScheme.omit({
    ingredientId: true,
});
export type CreateIngredientDto = z.infer<typeof CreateIngredientDto>;

// Update Ingredient DTO
export const UpdateIngredientDto = IngredientScheme.pick({
    ingredientId: true,
}).extend({
    name: IngredientScheme.shape.name.optional(),
    imageUrl: IngredientScheme.shape.imageUrl.optional(),
    quantity: IngredientScheme.shape.quantity.optional(),
    unit: IngredientScheme.shape.unit.optional(),
});
export type UpdateIngredientDto = z.infer<typeof UpdateIngredientDto>;
