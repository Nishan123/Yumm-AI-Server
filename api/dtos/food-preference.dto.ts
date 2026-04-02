import {z} from "zod";
import { FoodPreferenceScheme } from "../types/food-preference.type";

export const FoodPreferenceDto = FoodPreferenceScheme.pick({
    prefId:true,
    preferences:true,
    ownerId:true,
});

export type FoodPreferenceDto = z.infer<typeof FoodPreferenceDto>;
