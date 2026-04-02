import { FoodPreferenceDto } from "../dtos/food-preference.dto";
import { FoodPreferenceReposiotry, IFoodPreferenceRepository } from "../repositories/food-preference.repository";
import { FoodPreferenceType } from "../types/food-preference.type";

export class FoodPreferenceService {
    private foodPreferenceRepository: IFoodPreferenceRepository;

    constructor(
        foodPreferenceRepository: IFoodPreferenceRepository = new FoodPreferenceReposiotry()

    ) {
        this.foodPreferenceRepository = foodPreferenceRepository;
    }

    async createFoodPreference(foodPref:FoodPreferenceDto):Promise<FoodPreferenceType|null>{
        const foodPrefWithTimestamps: FoodPreferenceType = {
            ...foodPref,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return this.foodPreferenceRepository.createFoodPreference(foodPrefWithTimestamps);
    }

    async updateFoodPreference(prefId: string, foodPref: FoodPreferenceDto): Promise<FoodPreferenceType | null> {
        const updates = {
            ...foodPref,
            updatedAt: new Date()
        } as FoodPreferenceType;
        return this.foodPreferenceRepository.updateFoodPreference(prefId, updates);
    }

    async getFoodPreference(ownerId: string): Promise<FoodPreferenceType | null> {
        return this.foodPreferenceRepository.getFoodPreference(ownerId);
    }
}