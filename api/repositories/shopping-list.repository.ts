import { ShoppingListItemModel, IShoppingListItem } from "../models/shopping-list.model";
import { ShoppingListItemType } from "../types/shopping-list.type";

export interface IShoppingListRepository {
    createItem(item: ShoppingListItemType): Promise<IShoppingListItem>;
    findByUserId(userId: string, category?: string): Promise<IShoppingListItem[]>;
    findById(itemId: string): Promise<IShoppingListItem | null>;
    updateItem(itemId: string, data: Partial<ShoppingListItemType>): Promise<IShoppingListItem | null>;
    deleteItem(itemId: string): Promise<void>;
    deleteAllByUserId(userId: string): Promise<void>;
}

export class ShoppingListRepository implements IShoppingListRepository {
    async createItem(item: ShoppingListItemType): Promise<IShoppingListItem> {
        const created = await ShoppingListItemModel.create(item);
        return created;
    }

    async findByUserId(userId: string, category?: string): Promise<IShoppingListItem[]> {
        const filter: Record<string, unknown> = { userId };
        if (category && category !== "any") {
            filter.category = category;
        }
        return ShoppingListItemModel.find(filter)
            .sort({ createdAt: -1 })
            .exec();
    }

    async findById(itemId: string): Promise<IShoppingListItem | null> {
        return ShoppingListItemModel.findOne({ itemId }).exec();
    }

    async updateItem(itemId: string, data: Partial<ShoppingListItemType>): Promise<IShoppingListItem | null> {
        return ShoppingListItemModel.findOneAndUpdate(
            { itemId },
            data,
            { new: true }
        ).exec();
    }

    async deleteItem(itemId: string): Promise<void> {
        await ShoppingListItemModel.deleteOne({ itemId }).exec();
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        await ShoppingListItemModel.deleteMany({ userId }).exec();
    }
}
