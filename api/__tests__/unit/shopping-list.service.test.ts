import { ShoppingListService } from '../../services/shopping-list.service';
import { IShoppingListRepository } from '../../repositories/shopping-list.repository';
import { CreateShoppingListItemDto, UpdateShoppingListItemDto } from '../../dtos/shopping-list.dto';

describe('ShoppingListService', () => {
    let mockRepository: jest.Mocked<IShoppingListRepository>;
    let service: ShoppingListService;

    beforeEach(() => {
        mockRepository = {
            createItem: jest.fn(),
            findByUserId: jest.fn(),
            findById: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            deleteItemsByIngredientIds: jest.fn(),
        } as unknown as jest.Mocked<IShoppingListRepository>;

        service = new ShoppingListService(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addItem', () => {
        test('17. should create a new shopping list item successfully', async () => {
            const payload: CreateShoppingListItemDto = {
                quantity: '2',
                unit: 'kg',
                category: 'produce',
                ingredientId: 'ing-1',
            };
            const userId = 'user-123';

            mockRepository.createItem.mockResolvedValue(payload as any);

            const result = await service.addItem(userId, payload);

            expect(mockRepository.createItem).toHaveBeenCalledWith({
                ...payload,
                itemId: 'test-uuid-1234-5678-90ab-cdef',
                userId,
                isChecked: false,
            });
            expect(result).toBeDefined();
        });

        test('18. should throw validation error for invalid payload', async () => {
            const payload = {
                quantity: 'two', // invalid type
            } as any;

            await expect(service.addItem('user-1', payload)).rejects.toThrow();
        });
    });

    describe('getItems', () => {
        test('19. should return items for a user', async () => {
            mockRepository.findByUserId.mockResolvedValue([{ itemId: 'item-1' }] as any);

            const items = await service.getItems('user-1');

            expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-1', undefined);
            expect(items).toHaveLength(1);
        });

        test('20. should pass category if provided', async () => {
            await service.getItems('user-1', 'produce');
            expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-1', 'produce');
        });
    });

    describe('updateItem', () => {
        test('21. should update an item if it belongs to user', async () => {
            const updates: UpdateShoppingListItemDto = { isChecked: true };
            mockRepository.findById.mockResolvedValue({ userId: 'user-1' } as any);
            mockRepository.updateItem.mockResolvedValue({ ...updates } as any);

            const result = await service.updateItem('item-1', 'user-1', updates);

            expect(mockRepository.updateItem).toHaveBeenCalledWith('item-1', { isChecked: true, category: 'none' });
            expect(result).toBeDefined();
        });

        test('22. should return null if item not found', async () => {
            mockRepository.findById.mockResolvedValue(null);
            const result = await service.updateItem('item-1', 'user-1', { isChecked: true });
            expect(result).toBeNull();
        });

        test('23. should return null if item belongs to someone else', async () => {
            mockRepository.findById.mockResolvedValue({ userId: 'other-user' } as any);
            const result = await service.updateItem('item-1', 'user-1', { isChecked: true });
            expect(result).toBeNull();
            expect(mockRepository.updateItem).not.toHaveBeenCalled();
        });

        test('24. should throw validation error on invalid update data', async () => {
            const updates = { isChecked: 'yes' } as any;
            await expect(service.updateItem('item-1', 'user-1', updates)).rejects.toThrow();
        });
    });

    describe('deleteItem', () => {
        test('25. should delete item and return true if owner', async () => {
            mockRepository.findById.mockResolvedValue({ userId: 'user-1' } as any);
            mockRepository.deleteItem.mockResolvedValue(true as any);

            const result = await service.deleteItem('item-1', 'user-1');
            expect(mockRepository.deleteItem).toHaveBeenCalledWith('item-1');
            expect(result).toBe(true);
        });

        test('26. should return false if item not found', async () => {
            mockRepository.findById.mockResolvedValue(null);
            const result = await service.deleteItem('item-1', 'user-1');
            expect(result).toBe(false);
            expect(mockRepository.deleteItem).not.toHaveBeenCalled();
        });

        test('27. should return false if different user', async () => {
            mockRepository.findById.mockResolvedValue({ userId: 'other-user' } as any);
            const result = await service.deleteItem('item-1', 'user-1');
            expect(result).toBe(false);
            expect(mockRepository.deleteItem).not.toHaveBeenCalled();
        });
    });
});
