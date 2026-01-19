import mongoose, { Document, Schema } from "mongoose";
import { RecipeType } from "../types/recipe.type";
import { IngridentSchema } from "./ingrident.model";
import { KitchenToolSchema } from "./kitchen-tool.model";

const NutritionSchema: Schema = new Schema(
    {
        protein: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        fiber: { type: Number },
    },
    { _id: false }
);

const RecipeSchema: Schema = new Schema(
    {
        recipeId: { type: String, required: true, unique: true, index: true },
        generatedBy: { type: String, required: true, index: true },
        recipeName: { type: String, required: true },
        ingridents: { type: [IngridentSchema], required: true },
        steps: { type: [String], required: true },
        initialPrepration: { type: [String], required: true },
        kitchenTools: { type: [KitchenToolSchema], required: true },
        experienceLevel: { type: String, enum: ["newBie", "canCook", "expert"], required: true },
        estCookingTime: { type: String, required: true },
        description: { type: String, required: true },
        cusine: { type: String, required: true },
        calorie: { type: Number, required: true },
        images: { type: [String], required: true },
        nutrition: { type: NutritionSchema },
        servings: { type: Number, required: true },
        likes: { type: [String], default: [] },
    },
    {
        timestamps: true,
    }
);

export interface IRecipe extends RecipeType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const RecipeModel = mongoose.model<IRecipe>("Recipe", RecipeSchema);