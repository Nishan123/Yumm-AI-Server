import mongoose, { Schema, Document } from "mongoose";
import { FoodPreferenceType } from "../types/food-preference.type";

const FoodPreferenceScheme: Schema = new Schema(
    {
        prefId: { type: String, required: true, unique: true },
        preferences: { type: [String], default: [] },
        ownerId: { type: String, required: true, unique: true },

    },
    {
        timestamps: true
    }
);

export interface IFoodPreference extends FoodPreferenceType, Document {
    createdAt: Date;
    updatedAt: Date;
}

export const FoodPreferenceModel = mongoose.model<IFoodPreference>("FoodPreference", FoodPreferenceScheme);