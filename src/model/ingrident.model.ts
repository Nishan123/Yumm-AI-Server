import { Schema } from "mongoose";

export const IngridentSchema: Schema = new Schema(
    {
        ingridentId: { type: String, required: true },
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        quantity: { type: String, required: true },
        unit: { type: String, required: true },
    },
    { _id: false }
);
