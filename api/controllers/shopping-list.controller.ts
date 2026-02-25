import { Request, Response } from "express";
import { ShoppingListService } from "../services/shopping-list.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error";

export class ShoppingListController {
    private shoppingListService: ShoppingListService;

    constructor(shoppingListService: ShoppingListService = new ShoppingListService()) {
        this.shoppingListService = shoppingListService;
    }

    addItem = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                sendError(res, "Unauthorized", 401);
                return;
            }

            const item = await this.shoppingListService.addItem(userId, req.body);
            sendSuccess(res, item, 201, "Shopping list item added successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                sendError(res, "Validation failed", 422, error.issues);
                return;
            }
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 400);
        }
    };

    getItems = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                sendError(res, "Unauthorized", 401);
                return;
            }

            const category = req.query.category as string | undefined;
            const items = await this.shoppingListService.getItems(userId, category);
            sendSuccess(res, items, 200, "Shopping list fetched successfully");
        } catch (error) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 500);
        }
    };

    updateItem = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                sendError(res, "Unauthorized", 401);
                return;
            }

            const { itemId } = req.params;
            const updated = await this.shoppingListService.updateItem(itemId, userId, req.body);

            if (!updated) {
                sendError(res, "Item not found or unauthorized", 404);
                return;
            }

            sendSuccess(res, updated, 200, "Shopping list item updated successfully");
        } catch (error) {
            if (error instanceof ZodError) {
                sendError(res, "Validation failed", 422, error.issues);
                return;
            }
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 400);
        }
    };

    deleteItem = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                sendError(res, "Unauthorized", 401);
                return;
            }

            const { itemId } = req.params;
            const deleted = await this.shoppingListService.deleteItem(itemId, userId);

            if (!deleted) {
                sendError(res, "Item not found or unauthorized", 404);
                return;
            }

            sendSuccess(res, null, 200, "Shopping list item deleted successfully");
        } catch (error) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, (error as Error).message, 500);
        }
    };
}
