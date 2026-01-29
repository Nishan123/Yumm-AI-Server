import { Schema } from "mongoose";

export const IngredientSchema: Schema = new Schema(
    {
        ingredientId: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String, required: false, default: "" },
        quantity: { type: String, required: true },
        unit: { type: String, required: false, default: "" },  // Allow empty for staples like Salt, Pepper
        isReady: { type: Boolean, default: false },
    },
    { _id: false }
);
