import { Request, Response } from "express";
import { FoodPreferenceService } from "../services/food-preference.service";
import { sendSuccess, sendError } from "../utils/response.util";

export class FoodPreferenceController{
    private foodPreferenceService:FoodPreferenceService;

    constructor (foodPreferenceService:FoodPreferenceService=new FoodPreferenceService()){
        this.foodPreferenceService = foodPreferenceService;
    }

    createFoodPreference = async (req: Request, res: Response): Promise<void> => {
        try {
            const foodPref = req.body;
            const newFoodPref = await this.foodPreferenceService.createFoodPreference(foodPref);
            sendSuccess(res, newFoodPref, 201, "Food preference created successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    updateFoodPreference = async (req: Request, res: Response): Promise<void> => {
        try {
            const { prefId } = req.params;
            const foodPref = req.body;
            const updated = await this.foodPreferenceService.updateFoodPreference(prefId, foodPref);
            if (!updated) {
                sendError(res, "Food preference not found", 404);
                return;
            }
            sendSuccess(res, updated, 200, "Food preference updated successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    getFoodPreference = async (req: Request, res: Response): Promise<void> => {
        try {
            const { ownerId } = req.params;
            const foodPref = await this.foodPreferenceService.getFoodPreference(ownerId);
            if (!foodPref) {
                sendError(res, "Food preference not found", 404);
                return;
            }
            sendSuccess(res, foodPref);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}