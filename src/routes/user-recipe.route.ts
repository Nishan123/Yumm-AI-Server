import { Router } from "express";
import { UserRecipeController } from "../controllers/user-recipe.controller";

const router = Router();
const userRecipeController = new UserRecipeController();


router.post("/cookbook/private", userRecipeController.savePrivateRecipe);
router.post("/cookbook/add", userRecipeController.addToCookbook);
router.get("/cookbook/:userId", userRecipeController.getUserCookbook);
router.get("/cookbook/recipe/:userRecipeId", userRecipeController.getUserRecipe);
router.get("/cookbook/:userId/original/:originalRecipeId", userRecipeController.getUserRecipeByOriginal);
router.get("/cookbook/:userId/check/:originalRecipeId", userRecipeController.isRecipeInCookbook);
router.put("/cookbook/recipe/:userRecipeId", userRecipeController.updateUserRecipe);
router.put("/cookbook/recipe/:userRecipeId/full", userRecipeController.fullUpdateUserRecipe);
router.delete("/cookbook/recipe/:userRecipeId", userRecipeController.removeFromCookbook);
router.post("/cookbook/recipe/:userRecipeId/reset", userRecipeController.resetProgress);

export default router;
