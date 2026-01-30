import { v4 as uuidv4 } from "uuid";
import { IUserRecipe } from "../model/user-recipe.model";
import { IRecipe } from "../model/recipe.model";
import { IRecipeReposiory, RecipeRepository } from "../respositories/recipe.repository";
import { IUserRecipeRepository, UserRecipeRepository } from "../respositories/user-recipe.repository";

export class UserRecipeService {
    private userRecipeRepository: IUserRecipeRepository;
    private recipeRepository: IRecipeReposiory;

    constructor(
        userRecipeRepository: IUserRecipeRepository = new UserRecipeRepository(),
        recipeRepository: IRecipeReposiory = new RecipeRepository()
    ) {
        this.userRecipeRepository = userRecipeRepository;
        this.recipeRepository = recipeRepository;
    }

    /**
     * Save a private recipe directly to user's cookbook
     * This is used when a user generates a recipe and marks it as private.
     * Private recipes are NOT saved to the public Recipe collection.
     */
    async savePrivateRecipe(recipeData: IRecipe, userId: string): Promise<IUserRecipe> {
        const userRecipeId = uuidv4();
        
        const userRecipe: Partial<IUserRecipe> = {
            userRecipeId,
            userId,
            originalRecipeId: recipeData.recipeId, // Use the generated recipeId as reference
            originalGeneratedBy: userId, // The user is the creator of this private recipe
            recipeName: recipeData.recipeName,
            ingredients: recipeData.ingredients.map(ing => ({
                ingredientId: ing.ingredientId,
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                imageUrl: ing.imageUrl,
                isReady: false,
            })),
            steps: recipeData.steps.map((step: any) => ({
                id: step.id,
                instruction: step.instruction || step.step,
                isDone: false,
            })),
            initialPreparation: recipeData.initialPreparation.map((prep: any) => ({
                id: prep.id,
                instruction: prep.instruction || prep.step,
                isDone: false,
            })),
            kitchenTools: recipeData.kitchenTools.map(tool => ({
                toolId: tool.toolId,
                toolName: tool.toolName,
                imageUrl: tool.imageUrl,
                isReady: false,
            })),
            experienceLevel: recipeData.experienceLevel,
            estCookingTime: recipeData.estCookingTime,
            description: recipeData.description,
            mealType: recipeData.mealType,
            cuisine: recipeData.cuisine,
            calorie: recipeData.calorie,
            images: recipeData.images,
            nutrition: recipeData.nutrition,
            servings: recipeData.servings,
            addedAt: new Date(),
        };

        return this.userRecipeRepository.savePrivateRecipe(userRecipe as IUserRecipe);
    }

    /**
     * Add a recipe to user's cookbook
     * Creates a user-specific copy of the recipe for independent progress tracking
     */
    async addToCookbook(userId: string, recipeId: string): Promise<IUserRecipe> {
        // Check if already in cookbook
        const existing = await this.userRecipeRepository.getUserRecipeByOriginal(userId, recipeId);
        if (existing) {
            throw new Error("Recipe is already in your cookbook");
        }

        // Get the original recipe
        const originalRecipe = await this.recipeRepository.getRecipe(recipeId);
        if (!originalRecipe) {
            throw new Error("Original recipe not found");
        }

        // Create user-specific recipe instance
        const userRecipe: Partial<IUserRecipe> = {
            userRecipeId: uuidv4(),
            userId,
            originalRecipeId: recipeId,
            originalGeneratedBy: originalRecipe.generatedBy,
            recipeName: originalRecipe.recipeName,
            ingredients: originalRecipe.ingredients.map(ing => ({
                ingredientId: ing.ingredientId,
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                imageUrl: ing.imageUrl,
                isReady: false, // Reset progress for user
            })),
            steps: originalRecipe.steps.map((step: any) => ({
                id: step.id,
                instruction: step.instruction || step.step, // Handle both field names
                isDone: false, // Reset progress for user
            })),
            initialPreparation: originalRecipe.initialPreparation.map((prep: any) => ({
                id: prep.id,
                instruction: prep.instruction || prep.step, // Handle both field names
                isDone: false, // Reset progress for user
            })),
            kitchenTools: originalRecipe.kitchenTools.map(tool => ({
                toolId: tool.toolId,
                toolName: tool.toolName,
                imageUrl: tool.imageUrl,
                isReady: false, // Reset progress for user
            })),
            experienceLevel: originalRecipe.experienceLevel,
            estCookingTime: originalRecipe.estCookingTime,
            description: originalRecipe.description,
            mealType: originalRecipe.mealType,
            cuisine: originalRecipe.cuisine,
            calorie: originalRecipe.calorie,
            images: originalRecipe.images,
            nutrition: originalRecipe.nutrition,
            servings: originalRecipe.servings,
            addedAt: new Date(),
        };

        return this.userRecipeRepository.addToCookbook(userRecipe as IUserRecipe);
    }

    /**
     * Get all recipes in user's cookbook
     */
    async getUserCookbook(userId: string): Promise<Array<IUserRecipe>> {
        return this.userRecipeRepository.getUserCookbook(userId);
    }

    /**
     * Get a specific user recipe by its ID
     */
    async getUserRecipe(userRecipeId: string): Promise<IUserRecipe | null> {
        return this.userRecipeRepository.getUserRecipe(userRecipeId);
    }

    /**
     * Get a user's copy of a recipe by the original recipe ID
     */
    async getUserRecipeByOriginal(userId: string, originalRecipeId: string): Promise<IUserRecipe | null> {
        return this.userRecipeRepository.getUserRecipeByOriginal(userId, originalRecipeId);
    }

    /**
     * Update user's recipe progress (check/uncheck ingredients, instructions, etc.)
     */
    async updateUserRecipe(userRecipeId: string, updates: Partial<IUserRecipe>): Promise<IUserRecipe | null> {
        const existing = await this.userRecipeRepository.getUserRecipe(userRecipeId);
        if (!existing) {
            return null;
        }

        // Only allow updating progress fields, not recipe content
        const allowedUpdates: Partial<IUserRecipe> = {
            userRecipeId,
        };

        if (updates.ingredients) {
            allowedUpdates.ingredients = updates.ingredients;
        }
        if (updates.steps) {
            allowedUpdates.steps = updates.steps;
        }
        if (updates.initialPreparation) {
            allowedUpdates.initialPreparation = updates.initialPreparation;
        }
        if (updates.kitchenTools) {
            allowedUpdates.kitchenTools = updates.kitchenTools;
        }

        return this.userRecipeRepository.updateUserRecipe(allowedUpdates as IUserRecipe & { userRecipeId: string });
    }

    /**
     * Remove a recipe from user's cookbook
     */
    async removeFromCookbook(userRecipeId: string): Promise<boolean> {
        return this.userRecipeRepository.removeFromCookbook(userRecipeId);
    }

    /**
     * Check if a recipe is in user's cookbook
     */
    async isRecipeInCookbook(userId: string, originalRecipeId: string): Promise<boolean> {
        return this.userRecipeRepository.isRecipeInCookbook(userId, originalRecipeId);
    }

    /**
     * Reset progress for a user's recipe (uncheck all items)
     */
    async resetProgress(userRecipeId: string): Promise<IUserRecipe | null> {
        const existing = await this.userRecipeRepository.getUserRecipe(userRecipeId);
        if (!existing) {
            return null;
        }

        const updates: Partial<IUserRecipe> = {
            userRecipeId,
            ingredients: existing.ingredients.map(ing => ({
                ...ing,
                isReady: false,
            })),
            steps: existing.steps.map(step => ({
                ...step,
                isDone: false,
            })),
            initialPreparation: existing.initialPreparation.map(prep => ({
                ...prep,
                isDone: false,
            })),
            kitchenTools: existing.kitchenTools.map(tool => ({
                ...tool,
                isReady: false,
            })),
        };

        return this.userRecipeRepository.updateUserRecipe(updates as IUserRecipe & { userRecipeId: string });
    }
}
