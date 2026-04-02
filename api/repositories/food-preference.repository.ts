import { FoodPreferenceModel, IFoodPreference } from "../models/food-preference.model";
import { FoodPreferenceType } from "../types/food-preference.type";

export interface IFoodPreferenceRepository {
    createFoodPreference(foodPref: FoodPreferenceType): Promise<IFoodPreference>;
    updateFoodPreference(prefId: String, foodPref: FoodPreferenceType): Promise<IFoodPreference | null>;
    getFoodPreference(ownerId: string): Promise<IFoodPreference | null>;
}

export class FoodPreferenceReposiotry implements IFoodPreferenceRepository {
    async getFoodPreference(ownerId: string): Promise<IFoodPreference | null> {
        const result = await FoodPreferenceModel.findOne({ ownerId: ownerId });
        return result;
    }
    async createFoodPreference(foodPref: FoodPreferenceType): Promise<IFoodPreference> {
        const result = await FoodPreferenceModel.create(foodPref);
        return result;
    }
    async updateFoodPreference(predId: String, foodPref: FoodPreferenceType): Promise<IFoodPreference | null> {
        const result = await FoodPreferenceModel.findOneAndUpdate({ predId: foodPref.prefId }, { $set: foodPref }).exec();
        return result;
    }


}