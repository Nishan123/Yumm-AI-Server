import { Router } from "express";
import { RecipeController } from "../controllers/recipe.controller";
import { uploadRecipeImagesMiddleware } from "../middlewares/recipeImage.middleware";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const recipeController = new RecipeController();

router.post("/saveRecipe", recipeController.saveRecipe);
router.post("/recipe/:recipeId/save", authorizedMiddleWare, recipeController.toggleSaveRecipe);
router.get("/recipe/:recipeId", recipeController.getRecipe);
router.get("/userRecipe/:userId", recipeController.getCurrentUserRecipes);
router.get("/allRecipes", recipeController.getAllRecipes);
router.get("/publicRecipes", recipeController.getPublicRecipes);
router.put("/recipe/:recipeId", recipeController.updateRecipe);
router.delete("/recipe/:recipeId", recipeController.deleteRecipe);
router.delete("/recipe/:recipeId/cascade", recipeController.deleteRecipeWithCascade);
router.post(
    "/recipe/:recipeId/images",
    uploadRecipeImagesMiddleware.array("images", 2),
    recipeController.uploadRecipeImages
);

export default router;