import { Schema } from "mongoose";

export const InitialPreparationSchema: Schema = new Schema(
    {
        id: { type: String, required: true },
        instruction: { type: String, required: true },
        isDone: { type: Boolean, default: false },
    },
    { _id: false }
);
