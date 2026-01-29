import mongoose, { Document, Schema } from "mongoose";
import { UserRecipeType } from "../types/user-recipe.type";

// User ingredient schema with isReady field for progress tracking
const UserIngredientSchema = new Schema(
    {
        ingredientId: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String, default: "" },
        quantity: { type: String, required: true },
        unit: { type: String, default: "" },
        isReady: { type: Boolean, default: false },
    },
    { _id: false }
);

// User kitchen tool schema with isReady field for progress tracking
const UserKitchenToolSchema = new Schema(
    {
        toolId: { type: String, required: true },
        toolName: { type: String, required: true },
        imageUrl: { type: String, required: true },
        isReady: { type: Boolean, default: false },
    },
    { _id: false }
);

// Define InstructionSchema inline for user-specific recipes
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

/**
 * UserRecipe Schema - Stores user-specific instances of recipes
 * This allows each user to have their own progress tracking (checked ingredients, instructions, tools)
 * without affecting the original shared recipe or other users' progress.
 */
const UserRecipeSchema: Schema = new Schema(
    {
        // Unique identifier for this user-recipe instance
        userRecipeId: { type: String, required: true, unique: true, index: true },
        // The user who owns this cookbook entry
        userId: { type: String, required: true, index: true },
        // Reference to the original recipe
        originalRecipeId: { type: String, required: true, index: true },
        // Who originally created the recipe
        originalGeneratedBy: { type: String, required: true },
        // Recipe details (copied from original for user-specific tracking)
        recipeName: { type: String, required: true },
        ingredients: { type: [UserIngredientSchema], required: true },
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
        kitchenTools: { type: [UserKitchenToolSchema], required: true },
        experienceLevel: { type: String, enum: ["newBie", "canCook", "expert"], required: true },
        estCookingTime: { type: String, required: true },
        description: { type: String, required: true },
        mealType: { type: String, required: true },
        cuisine: { type: String, required: true },
        calorie: { type: Number, required: true },
        images: { type: [String], required: true, default: [] },
        nutrition: { type: NutritionSchema },
        servings: { type: Number, required: true },
        // When the recipe was added to cookbook
        addedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient lookups
UserRecipeSchema.index({ userId: 1, originalRecipeId: 1 }, { unique: true });

export interface IUserRecipe extends UserRecipeType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const UserRecipeModel = mongoose.model<IUserRecipe>("UserRecipe", UserRecipeSchema);
