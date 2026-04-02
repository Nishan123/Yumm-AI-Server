import { Router } from "express";
import { FoodPreferenceController } from "../controllers/food-preference.controller";
import { authorizedMiddleWare } from "../middlewares/authorized.middleware";

const router = Router();
const foodPrefController = new FoodPreferenceController();

router.post("/foodPref", authorizedMiddleWare, foodPrefController.createFoodPreference);
router.put("/foodPref/:prefId", authorizedMiddleWare, foodPrefController.updateFoodPreference);
router.get("/foodPref/:ownerId", authorizedMiddleWare, foodPrefController.getFoodPreference);

export default router;