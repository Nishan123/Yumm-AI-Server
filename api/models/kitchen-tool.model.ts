import mongoose, { Document, Schema } from "mongoose";
import { kitchenToolsType } from "../types/kitchen-tool.type";

export interface IKitchenTools extends kitchenToolsType, Document{
    createdAt:Date;
    updatedAt:Date;
}

export const KitchenToolSchema: Schema = new Schema(
    {
        uid: {type: String, required:true},
        toolId: { type: String, required: true },
        toolName: { type: String, required: true },
        imageUrl: { type: String, required: true },
        isReady: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const KitchenToolModel = mongoose.model<IKitchenTools>("Kitchen-tool", KitchenToolSchema);