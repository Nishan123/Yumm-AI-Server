import { Schema } from "mongoose";

export const KitchenToolSchema: Schema = new Schema(
    {
        toolId: { type: String, required: true },
        toolName: { type: String, required: true },
        imageUrl: { type: String, required: true },
    },
    { _id: false }
);
