import mongoose, { Document, Schema } from "mongoose";
import { ShoppingListItemType } from "../types/shopping-list.type";

const ShoppingListItemSchema: Schema = new Schema(
    {
        itemId: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        quantity: { type: String, required: true },
        unit: { type: String, required: true },
        category: { type: String, required: false, default: "none" },
        isChecked: { type: Boolean, default: false },
        ingredientId: { type: String, required: false, default: "" },
    },
    {
        timestamps: true,
    }
);

export interface IShoppingListItem extends Omit<ShoppingListItemType, '_id'>, Document {
    createdAt: Date;
    updatedAt: Date;
}

export const ShoppingListItemModel = mongoose.model<IShoppingListItem>("ShoppingListItem", ShoppingListItemSchema);
