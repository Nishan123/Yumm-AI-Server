import { INotification, NotificationModel } from "../models/notification.model";
import { NotificationType } from "../types/notification.type";

export class NotificationRepository {
    async createLog(data: NotificationType): Promise<INotification> {
        return await NotificationModel.create(data);
    }

    async getLogs(page: number = 1, limit: number = 20): Promise<{ logs: INotification[], total: number }> {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            NotificationModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            NotificationModel.countDocuments()
        ]);
        return { logs, total };
    }

    async deleteLog(id: string): Promise<boolean> {
        const result = await NotificationModel.findByIdAndDelete(id);
        return !!result;
    }
}
