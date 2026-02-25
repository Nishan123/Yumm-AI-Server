import { z } from "zod";
import { ShoppingListItemScheme } from "../types/shopping-list.type";

export const CreateShoppingListItemDto = ShoppingListItemScheme.pick({
    name: true,
    imageUrl: true,
    quantity: true,
    unit: true,
    category: true,
    ingredientId: true,
});

export type CreateShoppingListItemDto = z.infer<typeof CreateShoppingListItemDto>;

export const UpdateShoppingListItemDto = ShoppingListItemScheme.pick({
    name: true,
    quantity: true,
    unit: true,
    category: true,
    isChecked: true,
}).partial();

export type UpdateShoppingListItemDto = z.infer<typeof UpdateShoppingListItemDto>;
