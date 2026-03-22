import { IKitchenTools } from "../models/kitchen-tool.model";
import { KitchenToolsRepository } from "../repositories/kitchen-tools.reporisory";
import { kitchenToolsType } from "../types/kitchen-tool.type";

export class KitchenToolsService {
    private kitchenToolRepo: KitchenToolsRepository;

    constructor() {
        this.kitchenToolRepo = new KitchenToolsRepository();
    }

    async saveKitchenTool(data: kitchenToolsType, uid: string): Promise<IKitchenTools> {
        return await this.kitchenToolRepo.saveKitchenTool(data, uid);
    }

    async deleteKitchenTool(toolId: string, userId: string): Promise<boolean> {
        return await this.kitchenToolRepo.deleteKitchenTool(toolId, userId);
    }

    async getUsersKitchenTool(userId: string, limit: number = 40, page: number = 1): Promise<{ tools: IKitchenTools[], total: number }> {
        return await this.kitchenToolRepo.getUsersKitchenTool(userId, limit, page);
    }
}