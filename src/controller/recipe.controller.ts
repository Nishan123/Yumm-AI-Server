import { Request, Response } from "express";
import { RecipeService } from "../services/recipe.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { IRecipe } from "../model/recipe.model";

export class RecipeController {
    private recipeService: RecipeService;

    constructor(recipeService: RecipeService = new RecipeService()) {
        this.recipeService = recipeService;
    }

    saveRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const newRecipe: IRecipe = req.body;
            const recipe = await this.recipeService.saveRecipe(newRecipe);
            sendSuccess(res, recipe, 201, "Recipe created successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    getRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { recipeId } = req.params;
            const recipe = await this.recipeService.getRecipe(recipeId);
            if (!recipe) {
                sendError(res, "Recipe not found", 404);
                return;
            }
            sendSuccess(res, recipe);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    getAllRecipes = async (_req: Request, res: Response): Promise<void> => {
        try {
            const recipes = await this.recipeService.getAllRecipes();
            sendSuccess(res, recipes);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    getCurrentUserRecipes = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const recipes = await this.recipeService.getCurrentUserRecipes(userId);
            sendSuccess(res, recipes);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    updateRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { recipeId } = req.params;
            const recipeData: IRecipe = { ...req.body, recipeId };
            const updated = await this.recipeService.updateRecipe(recipeData);
            if (!updated) {
                sendError(res, "Recipe not found", 404);
                return;
            }
            sendSuccess(res, updated);
        } catch (error) {
            sendError(res, (error as Error).message, 400);
        }
    };

    deleteRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { recipeId } = req.params;
            const deleted = await this.recipeService.deleteRecipe(recipeId);
            if (!deleted) {
                sendError(res, "Recipe not found", 404);
                return;
            }
            sendSuccess(res, null, 200, "Recipe deleted successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}
