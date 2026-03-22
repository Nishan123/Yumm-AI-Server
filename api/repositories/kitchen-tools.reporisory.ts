import mongoose from "mongoose";
import { IKitchenTools, KitchenToolSchema } from "../models/kitchen-tool.model";
import { kitchenToolsType } from "../types/kitchen-tool.type";

export class KitchenToolsRepository {
    /**
     * Helper to get or create a Mongoose model for a specific user's collection.
     * Uses uid as the collection name as requested.
     */
    private getModel(uid: string) {
        // Create a unique model name for each user to avoid conflict, 
        // while specifying the literal uid as the collection name.
        const modelName = `KitchenTool_${uid}`;
        if (mongoose.models[modelName]) {
            return mongoose.models[modelName] as mongoose.Model<IKitchenTools>;
        }
        return mongoose.model<IKitchenTools>(modelName, KitchenToolSchema, uid);
    }

    async saveKitchenTool(data: kitchenToolsType, uid: string): Promise<IKitchenTools> {
        const UserToolModel = this.getModel(uid);
        // Using create directly with the schema-compliant data
        return await UserToolModel.create(data);
    }

    async deleteKitchenTool(toolId: string, userId: string): Promise<boolean> {
        const UserToolModel = this.getModel(userId);
        // Ensure we filter by toolId within the correct user's collection
        const result = await UserToolModel.findOneAndDelete({ "toolId": toolId });
        return !!result;
    }

    async getUsersKitchenTool(userId: string, limit: number = 40, page: number = 1): Promise<{ tools: IKitchenTools[], total: number }> {
        const UserToolModel = this.getModel(userId);
        const skip = (page - 1) * limit;

        // Query only the user's specific collection
        const [tools, total] = await Promise.all([
            UserToolModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            UserToolModel.countDocuments()
        ]);
        return { tools, total };
    }
}