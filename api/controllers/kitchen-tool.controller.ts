import { Request, Response } from "express";
import { KitchenToolsService } from "../services/kitchen-tools.service";
import { sendSuccess, sendError } from "../utils/response.util";

const kitchenToolService = new KitchenToolsService();

export class KitchenToolController {
    async saveTool (req: Request, res: Response)  {
        try {
            const { toolId, toolName, imageUrl } = req.body;
            const uid = req.user?.id;
            if (!uid) {
                return sendError(res, "User not authenticated", 401);
            }
            if (!toolId || !toolName || !imageUrl) {
                return sendError(res, "Missing required fields: toolId, toolName, or imageUrl", 400);
            }

            const tool = await kitchenToolService.saveKitchenTool({ uid, toolId, toolName, imageUrl }, uid);
            return sendSuccess(res, tool, 201, "Kitchen tool saved successfully");
        } catch (error: any) {
            console.error("Error in saveTool controller:", error);
            return sendError(res, error.message || "Internal server error", 500);
        }
    }

    async getTools (req: Request, res: Response) {
        try {
            const uid = req.params.userId;
            if (!uid) {
                return sendError(res, "User not authenticated", 401);
            }

            const limit = parseInt(req.query.limit as string) || 40;
            const page = parseInt(req.query.page as string) || 1;

            const result = await kitchenToolService.getUsersKitchenTool(uid, limit, page);
            return sendSuccess(res, result, 200, "Kitchen tools fetched successfully");
        } catch (error: any) {
            console.error("Error in getTools controller:", error);
            return sendError(res, error.message || "Internal server error", 500);
        }
    }

    async deleteTool (req: Request, res: Response) {
        try {
            const { toolId } = req.params;
            const uid = req.params.userId;
            if (!uid) {
                return sendError(res, "User not authenticated", 401);
            }
            if (!toolId) {
                return sendError(res, "Missing toolId", 400);
            }

            const success = await kitchenToolService.deleteKitchenTool(toolId, uid);
            if (!success) {
                return sendError(res, "Kitchen tool not found or could not be deleted", 404);
            }

            return sendSuccess(res, null, 200, "Kitchen tool deleted successfully");
        } catch (error: any) {
            console.error("Error in deleteTool controller:", error);
            return sendError(res, error.message || "Internal server error", 500);
        }
    }

}