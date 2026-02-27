import { DeletedUserModel, IDeletedUser } from "../models/deleted-user.model";
import { QueryFilter } from "mongoose";

export interface IDeletedUserRepository {
    getAllDeletedUsers(page: number, size: number, searchTerm?: string): Promise<{ deletedUsers: IDeletedUser[], total: number }>;
}

export class DeletedUserRepository implements IDeletedUserRepository {
    async getAllDeletedUsers(page: number, size: number, searchTerm?: string): Promise<{ deletedUsers: IDeletedUser[]; total: number; }> {
        const filter: QueryFilter<IDeletedUser> = {};
        if (searchTerm) {
            filter.$or = [
                { fullName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const [deletedUsers, total] = await Promise.all([
            DeletedUserModel.find(filter)
                .sort({ deletedAt: -1 })
                .skip((page - 1) * size)
                .limit(size)
                .exec(),
            DeletedUserModel.countDocuments(filter).exec()
        ]);

        return { deletedUsers, total };
    }
}
