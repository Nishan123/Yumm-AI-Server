import { Request, Response } from "express";
import { UserRecipeService } from "../services/user-recipe.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { IUserRecipe } from "../models/user-recipe.model";
import { IRecipe } from "../models/recipe.model";

export class UserRecipeController {
    private userRecipeService: UserRecipeService;

    constructor(userRecipeService: UserRecipeService = new UserRecipeService()) {
        this.userRecipeService = userRecipeService;
    }

    /**
     * Save a private recipe directly to user's cookbook
     * POST /api/cookbook/private
     * Body: Recipe data with userId
     */
    savePrivateRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const recipeData = req.body as IRecipe & { userId: string };
            const { userId } = recipeData;

            if (!userId) {
                sendError(res, "userId is required", 400);
                return;
            }

            if (!recipeData.recipeId) {
                sendError(res, "recipeId is required", 400);
                return;
            }

            const userRecipe = await this.userRecipeService.savePrivateRecipe(recipeData, userId);
            sendSuccess(res, userRecipe, 201, "Private recipe saved to cookbook successfully");
        } catch (error) {
            const message = (error as Error).message;
            sendError(res, message, 500);
        }
    };

    /**
     * Add a recipe to user's cookbook
     * POST /api/cookbook/add
     * Body: { userId: string, recipeId: string }
     */
    addToCookbook = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, recipeId } = req.body;

            if (!userId || !recipeId) {
                sendError(res, "userId and recipeId are required", 400);
                return;
            }

            const userRecipe = await this.userRecipeService.addToCookbook(userId, recipeId);
            sendSuccess(res, userRecipe, 201, "Recipe added to cookbook successfully");
        } catch (error) {
            const message = (error as Error).message;
            if (message === "Recipe is already in your cookbook") {
                sendError(res, message, 409);
            } else if (message === "Original recipe not found") {
                sendError(res, message, 404);
            } else {
                sendError(res, message, 500);
            }
        }
    };

    /**
     * Get all recipes in user's cookbook
     * GET /api/cookbook/:userId
     */
    getUserCookbook = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            if (!userId) {
                sendError(res, "userId is required", 400);
                return;
            }

            const recipes = await this.userRecipeService.getUserCookbook(userId);
            sendSuccess(res, recipes);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Get a specific user recipe
     * GET /api/cookbook/recipe/:userRecipeId
     */
    getUserRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userRecipeId } = req.params;

            if (!userRecipeId) {
                sendError(res, "userRecipeId is required", 400);
                return;
            }

            const recipe = await this.userRecipeService.getUserRecipe(userRecipeId);
            if (!recipe) {
                sendError(res, "User recipe not found", 404);
                return;
            }

            sendSuccess(res, recipe);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Get user's copy of a recipe by original recipe ID
     * GET /api/cookbook/:userId/original/:originalRecipeId
     */
    getUserRecipeByOriginal = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, originalRecipeId } = req.params;

            if (!userId || !originalRecipeId) {
                sendError(res, "userId and originalRecipeId are required", 400);
                return;
            }

            const recipe = await this.userRecipeService.getUserRecipeByOriginal(userId, originalRecipeId);
            if (!recipe) {
                sendError(res, "Recipe not found in cookbook", 404);
                return;
            }

            sendSuccess(res, recipe);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Update user's recipe progress
     * PUT /api/cookbook/recipe/:userRecipeId
     * Body: { ingredients?: [], steps?: [], initialPreparation?: [], kitchenTools?: [] }
     */
    updateUserRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userRecipeId } = req.params;
            const updates: Partial<IUserRecipe> = req.body;

            if (!userRecipeId) {
                sendError(res, "userRecipeId is required", 400);
                return;
            }

            const updated = await this.userRecipeService.updateUserRecipe(userRecipeId, updates);
            if (!updated) {
                sendError(res, "User recipe not found", 404);
                return;
            }

            sendSuccess(res, updated, 200, "Recipe progress updated successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Remove a recipe from user's cookbook
     * DELETE /api/cookbook/recipe/:userRecipeId
     */
    removeFromCookbook = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userRecipeId } = req.params;

            if (!userRecipeId) {
                sendError(res, "userRecipeId is required", 400);
                return;
            }

            const deleted = await this.userRecipeService.removeFromCookbook(userRecipeId);
            if (!deleted) {
                sendError(res, "User recipe not found", 404);
                return;
            }

            sendSuccess(res, null, 200, "Recipe removed from cookbook successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Check if a recipe is in user's cookbook
     * GET /api/cookbook/:userId/check/:originalRecipeId
     */
    isRecipeInCookbook = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, originalRecipeId } = req.params;

            if (!userId || !originalRecipeId) {
                sendError(res, "userId and originalRecipeId are required", 400);
                return;
            }

            const isInCookbook = await this.userRecipeService.isRecipeInCookbook(userId, originalRecipeId);
            sendSuccess(res, { isInCookbook });
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Reset progress for a user's recipe
     * POST /api/cookbook/recipe/:userRecipeId/reset
     */
    resetProgress = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userRecipeId } = req.params;

            if (!userRecipeId) {
                sendError(res, "userRecipeId is required", 400);
                return;
            }

            const reset = await this.userRecipeService.resetProgress(userRecipeId);
            if (!reset) {
                sendError(res, "User recipe not found", 404);
                return;
            }

            sendSuccess(res, reset, 200, "Recipe progress reset successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    /**
     * Full update of a user's recipe content (not just progress)
     * PUT /api/cookbook/recipe/:userRecipeId/full
     * Body: Full recipe data
     */
    fullUpdateUserRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userRecipeId } = req.params;
            const updates: Partial<IUserRecipe> = req.body;

            if (!userRecipeId) {
                sendError(res, "userRecipeId is required", 400);
                return;
            }

            const updated = await this.userRecipeService.fullUpdateUserRecipe(userRecipeId, updates);
            if (!updated) {
                sendError(res, "User recipe not found", 404);
                return;
            }

            sendSuccess(res, updated, 200, "Recipe updated successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}
