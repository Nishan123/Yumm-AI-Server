import { Request, Response } from "express";
import { AdminDeletedUserService } from "../../services/admin/admin-deleted-user.service";
import { sendSuccess, sendError } from "../../utils/response.util";

interface QueryParams {
    page?: string;
    size?: string;
    searchTerm?: string;
}

export class DeletedUserController {
    private adminDeletedUserService: AdminDeletedUserService;

    constructor(adminDeletedUserService: AdminDeletedUserService = new AdminDeletedUserService()) {
        this.adminDeletedUserService = adminDeletedUserService;
    }

    getAllDeletedUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, size, searchTerm }: QueryParams = req.query;
            const { deletedUsers, pagination } = await this.adminDeletedUserService.getAllDeletedUsers(
                page, size, searchTerm
            );
            sendSuccess(res, { deletedUsers, pagination }, 200, "Deleted users fetched successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}
