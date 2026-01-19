import { z } from "zod";
import { IngridentScheme } from "../types/ingrident.type";

// Create Ingredient DTO
export const CreateIngridentDto = IngridentScheme.omit({
    ingridentId: true,
});
export type CreateIngridentDto = z.infer<typeof CreateIngridentDto>;

// Update Ingredient DTO
export const UpdateIngridentDto = IngridentScheme.pick({
    ingridentId: true,
}).extend({
    name: IngridentScheme.shape.name.optional(),
    imageUrl: IngridentScheme.shape.imageUrl.optional(),
    quantity: IngridentScheme.shape.quantity.optional(),
    unit: IngridentScheme.shape.unit.optional(),
});
export type UpdateIngridentDto = z.infer<typeof UpdateIngridentDto>;
