import { Router } from "express";
import { RecipeController } from "../controller/recipe.controller";

const router = Router();
const recipeController = new RecipeController();

router.post("/saveRecipe", recipeController.saveRecipe);
router.get("/recipe/:recipeId", recipeController.getRecipe);
router.get("/userRecipe/:userId", recipeController.getCurrentUserRecipes);
router.get("/allRecipes", recipeController.getAllRecipes);
router.put("/recipe/:recipeId", recipeController.updateRecipe);
router.delete("/recipe/:recipeId", recipeController.deleteRecipe);

export default router;