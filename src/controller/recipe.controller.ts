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
            let recipeData = req.body;

            // Debug logging
            console.log("=== SAVE RECIPE DEBUG ===");
            console.log("Content-Type:", req.headers['content-type']);
            console.log("Body type:", typeof req.body);

            // Ensure steps is properly parsed (handles edge case where it might be stringified)
            if (typeof recipeData.steps === 'string') {
                console.log("WARNING: steps was a string, parsing...");
                try {
                    recipeData.steps = JSON.parse(recipeData.steps);
                } catch (e) {
                    console.log("Failed to parse steps string:", e);
                }
            }

            // Ensure initialPreparation is properly parsed
            if (typeof recipeData.initialPreparation === 'string') {
                console.log("WARNING: initialPreparation was a string, parsing...");
                try {
                    recipeData.initialPreparation = JSON.parse(recipeData.initialPreparation);
                } catch (e) {
                    console.log("Failed to parse initialPreparation string:", e);
                }
            }

            // Ensure ingredients is properly parsed
            if (typeof recipeData.ingredients === 'string') {
                console.log("WARNING: ingredients was a string, parsing...");
                try {
                    recipeData.ingredients = JSON.parse(recipeData.ingredients);
                } catch (e) {
                    console.log("Failed to parse ingredients string:", e);
                }
            }

            // Ensure kitchenTools is properly parsed
            if (typeof recipeData.kitchenTools === 'string') {
                console.log("WARNING: kitchenTools was a string, parsing...");
                try {
                    recipeData.kitchenTools = JSON.parse(recipeData.kitchenTools);
                } catch (e) {
                    console.log("Failed to parse kitchenTools string:", e);
                }
            }

            // Log the parsed data
            if (recipeData.steps) {
                console.log("steps type:", typeof recipeData.steps);
                console.log("steps isArray:", Array.isArray(recipeData.steps));
                if (recipeData.steps.length > 0) {
                    console.log("steps[0] type:", typeof recipeData.steps[0]);
                }
            }
            console.log("=========================");

            const newRecipe: IRecipe = recipeData;
            const recipe = await this.recipeService.saveRecipe(newRecipe);
            sendSuccess(res, recipe, 201, "Recipe created successfully");
        } catch (error) {
            console.log("SAVE RECIPE ERROR:", (error as Error).message);
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

    getPublicRecipes = async (_req: Request, res: Response): Promise<void> => {
        try {
            const recipes = await this.recipeService.getPublicRecipes();
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

    uploadRecipeImages = async (req: Request, res: Response): Promise<void> => {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                sendError(res, "No images uploaded", 400);
                return;
            }

            // Construct public URLs
            const imageUrls = files.map(
                (file) => `http://localhost:${process.env.PORT || 5000}/public/recipeImages/${file.filename}`
            );

            sendSuccess(res, { images: imageUrls }, 200, "Images uploaded successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}
