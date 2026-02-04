import { Router } from "express";
import { UserRecipeController } from "../controllers/user-recipe.controller";

const router = Router();
const userRecipeController = new UserRecipeController();

// Save private recipe directly to cookbook (not to public recipes)
router.post("/cookbook/private", userRecipeController.savePrivateRecipe);

// Add recipe to cookbook
router.post("/cookbook/add", userRecipeController.addToCookbook);

// Get all recipes in user's cookbook
router.get("/cookbook/:userId", userRecipeController.getUserCookbook);

// Get a specific user recipe
router.get("/cookbook/recipe/:userRecipeId", userRecipeController.getUserRecipe);

// Get user's copy of a recipe by original recipe ID
router.get("/cookbook/:userId/original/:originalRecipeId", userRecipeController.getUserRecipeByOriginal);

// Check if a recipe is in user's cookbook
router.get("/cookbook/:userId/check/:originalRecipeId", userRecipeController.isRecipeInCookbook);

// Update user's recipe progress
router.put("/cookbook/recipe/:userRecipeId", userRecipeController.updateUserRecipe);

// Full update user's recipe content
router.put("/cookbook/recipe/:userRecipeId/full", userRecipeController.fullUpdateUserRecipe);

// Remove recipe from cookbook
router.delete("/cookbook/recipe/:userRecipeId", userRecipeController.removeFromCookbook);

// Reset recipe progress
router.post("/cookbook/recipe/:userRecipeId/reset", userRecipeController.resetProgress);

export default router;
