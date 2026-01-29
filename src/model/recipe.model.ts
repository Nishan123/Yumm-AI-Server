import mongoose, { Document, Schema } from "mongoose";
import { RecipeType } from "../types/recipe.type";
import { IngredientSchema } from "./ingredient.model";
import { KitchenToolSchema } from "./kitchen-tool.model";

// Define InstructionSchema inline to avoid any import issues
const InstructionSubSchema = new Schema(
    {
        id: { type: String, required: true },
        instruction: { type: String, required: true },
        isDone: { type: Boolean, default: false },
    },
    { _id: false }
);

// Define InitialPreparationSchema inline
const InitialPreparationSubSchema = new Schema(
    {
        id: { type: String, required: true },
        instruction: { type: String, required: true },
        isDone: { type: Boolean, default: false },
    },
    { _id: false }
);


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
        ingredients: { type: [IngredientSchema], required: true },
        steps: {
            type: [InstructionSubSchema],
            required: true,
            default: [],
        },
        initialPreparation: {
            type: [InitialPreparationSubSchema],
            required: true,
            default: [],
        },
        kitchenTools: { type: [KitchenToolSchema], required: true },
        experienceLevel: { type: String, enum: ["newBie", "canCook", "expert"], required: true },
        estCookingTime: { type: String, required: true },
        description: { type: String, required: true },
        mealType: { type: String, required: true },
        cuisine: { type: String, required: true },
        calorie: { type: Number, required: true },
        images: { type: [String], required: true, default: [] },
        nutrition: { type: NutritionSchema },
        servings: { type: Number, required: true },
        likes: { type: [String], default: [] },
        isPublic: { type: Boolean, default: true, index: true },
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