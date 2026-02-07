import { Request, Response } from "express";
import { CreateUserDto } from "../../dtos/auth.dto";
import { AdminUserService } from "../../services/admin/admin-user.service";
import { sendSuccess, sendError } from "../../utils/response.util";
import { v4 as uuidv4 } from "uuid";

import { ZodError } from "zod";
import { HttpError } from "../../errors/http-error";

interface QueryParams {
    page?: string;
    size?: string;
    searchTerm?: string;
}

export class AdminUserController {
    private adminUserService: AdminUserService;

    constructor(adminUserService: AdminUserService = new AdminUserService()) {
        this.adminUserService = adminUserService;
    }

    // Create new user (admin only)
    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: CreateUserDto = req.body;

            // Handle profile picture if uploaded
            const file = req.file;
            const created = await this.adminUserService.createUser(payload, file);
            sendSuccess(res, created, 201, "User created successfully");
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

    // Get all users (admin only)
    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page, size, searchTerm }: QueryParams = req.query;
            const { users, pagination } = await this.adminUserService.getAllUsersPaginated(
                page, size, searchTerm
            );
            sendSuccess(res, { users, pagination }, 200, "Users fetched successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    // Get user by ID (admin only)
    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const user = await this.adminUserService.getUserById(id);
            if (!user) {
                sendError(res, "User not found", 404);
                return;
            }
            sendSuccess(res, user);
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };

    // Update user (admin only)
    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Handle profile picture if uploaded
            const file = req.file;
            const updated = await this.adminUserService.updateUserById(id, req.body, file);
            if (!updated) {
                sendError(res, "User not found", 404);
                return;
            }
            sendSuccess(res, updated, 200, "User updated successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 400);
        }
    };

    // Delete user (admin only)
    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const deleted = await this.adminUserService.deleteUserById(id);
            if (!deleted) {
                sendError(res, "User not found", 404);
                return;
            }
            sendSuccess(res, null, 200, "User deleted successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 500);
        }
    };
}

