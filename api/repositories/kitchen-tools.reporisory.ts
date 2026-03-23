import mongoose from "mongoose";
import { IKitchenTools, KitchenToolModel } from "../models/kitchen-tool.model";
import { kitchenToolsType } from "../types/kitchen-tool.type";

export class KitchenToolsRepository {
    async saveKitchenTool(data: kitchenToolsType, uid: string): Promise<IKitchenTools> {
        return await KitchenToolModel.create(data);
    }

    async deleteKitchenTool(toolId: string, userId: string): Promise<boolean> {
        const result = await KitchenToolModel.findOneAndDelete({ toolId: toolId, uid: userId });
        return !!result;
    }

    async getUsersKitchenTool(userId: string, limit: number = 40, page: number = 1): Promise<{ tools: IKitchenTools[], total: number }> {
        const skip = (page - 1) * limit;

        const [tools, total] = await Promise.all([
            KitchenToolModel.find({ uid: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            KitchenToolModel.countDocuments({ uid: userId })
        ]);
        return { tools, total };
    }
}