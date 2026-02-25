import { z } from "zod";

// Extended ingredient scheme with progress tracking
export const UserIngredientScheme = z.object({
    ingredientId: z.string().min(1, { error: "Ingredient ID required" }),
    name: z.string().min(1, { error: "Ingredient name required" }),
    imageUrl: z.string().optional().default(""),
    quantity: z.string().min(1, { error: "Quantity required" }),
    unit: z.string().optional().default(""),
    isReady: z.boolean().default(false),
});

// Extended kitchen tool scheme with progress tracking
export const UserKitchenToolScheme = z.object({
    toolId: z.string().min(1, { error: "Kitchen toolId required" }),
    toolName: z.string().min(1, { error: "Kitchen tool name required" }),
    imageUrl: z.string().min(1, { error: "Kitchen tool image url" }),
    isReady: z.boolean().default(false),
});

export const InstructionScheme = z.object({
    id: z.string().min(1, { error: "Instruction ID required" }),
    instruction: z.string().min(1, { error: "Instruction text required" }),
    isDone: z.boolean().default(false),
});

export const InitialPreparationScheme = z.object({
    id: z.string().min(1, { error: "Preparation ID required" }),
    instruction: z.string().min(1, { error: "Instruction text required" }),
    isDone: z.boolean().default(false),
});

export const UserRecipeScheme = z.object({
    userRecipeId: z.string().min(1, { error: "User Recipe ID required" }),
    userId: z.string().min(1, { error: "User ID required" }),
    originalRecipeId: z.string().min(1, { error: "Original Recipe ID required" }),
    originalGeneratedBy: z.string().min(1, { error: "Original generator ID required" }),
    recipeName: z.string().min(1, { error: "Recipe name is required" }),
    ingredients: z.array(UserIngredientScheme).min(1, { error: "Ingredients required" }),
    steps: z.array(InstructionScheme).min(1, { error: "Steps Required" }),
    initialPreparation: z.array(InitialPreparationScheme).default([]),
    kitchenTools: z.array(UserKitchenToolScheme).min(1, { error: "Kitchen tools required" }),
    experienceLevel: z.enum(["newBie", "canCook", "expert"]),
    estCookingTime: z.string().min(1, { error: "Estimated time required" }),
    description: z.string().min(1, { error: "Description required" }),
    mealType: z.string().min(1, { error: "Meal type required" }),
    cuisine: z.string().min(1, { error: "Cuisine required" }),
    calorie: z.number().positive({ message: "Calorie must be > 0" }),
    images: z.array(z.string()).default([]),
    nutrition: z.object({
        protein: z.number().optional(),
        carbs: z.number().optional(),
        fat: z.number().optional(),
        fiber: z.number().optional(),
    }).optional(),
    servings: z.number().int().positive(),
    addedAt: z.coerce.date().default(() => new Date()),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});

export type UserRecipeType = z.infer<typeof UserRecipeScheme>;

// DTO for adding a recipe to cookbook
export const AddToCookbookDto = z.object({
    userId: z.string().min(1, { error: "User ID required" }),
    recipeId: z.string().min(1, { error: "Recipe ID required" }),
});

export type AddToCookbookDtoType = z.infer<typeof AddToCookbookDto>;

// DTO for updating a user's recipe progress
export const UpdateUserRecipeDto = z.object({
    userRecipeId: z.string().min(1, { error: "User Recipe ID required" }),
    ingredients: z.array(UserIngredientScheme).optional(),
    steps: z.array(InstructionScheme).optional(),
    initialPreparation: z.array(InitialPreparationScheme).optional(),
    kitchenTools: z.array(UserKitchenToolScheme).optional(),
});

export type UpdateUserRecipeDtoType = z.infer<typeof UpdateUserRecipeDto>;
