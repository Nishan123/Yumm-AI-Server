import { ShoppingListRepository, IShoppingListRepository } from "../repositories/shopping-list.repository";
import { CreateShoppingListItemDto, UpdateShoppingListItemDto } from "../dtos/shopping-list.dto";
import { ShoppingListItemType } from "../types/shopping-list.type";
import { v4 as uuidv4 } from "uuid";

export class ShoppingListService {
    private shoppingListRepository: IShoppingListRepository;

    constructor(shoppingListRepository: IShoppingListRepository = new ShoppingListRepository()) {
        this.shoppingListRepository = shoppingListRepository;
    }

    async addItem(userId: string, payload: CreateShoppingListItemDto): Promise<ShoppingListItemType> {
        const validatedData = CreateShoppingListItemDto.parse(payload);

        const itemToCreate: ShoppingListItemType = {
            ...validatedData,
            itemId: uuidv4(),
            userId,
            isChecked: false,
        };

        return this.shoppingListRepository.createItem(itemToCreate);
    }

    async getItems(userId: string, category?: string): Promise<ShoppingListItemType[]> {
        return this.shoppingListRepository.findByUserId(userId, category);
    }

    async updateItem(itemId: string, userId: string, payload: UpdateShoppingListItemDto): Promise<ShoppingListItemType | null> {
        const validatedData = UpdateShoppingListItemDto.parse(payload);

        // Verify the item belongs to the user
        const existing = await this.shoppingListRepository.findById(itemId);
        if (!existing || existing.userId !== userId) {
            return null;
        }

        return this.shoppingListRepository.updateItem(itemId, validatedData);
    }

    async deleteItem(itemId: string, userId: string): Promise<boolean> {
        const existing = await this.shoppingListRepository.findById(itemId);
        if (!existing || existing.userId !== userId) {
            return false;
        }

        await this.shoppingListRepository.deleteItem(itemId);
        return true;
    }
}
