import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/auth.dto";
import { AdminUserService } from "../services/admin/admin-user.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { ZodError } from "zod";
import { HttpError } from "../errors/http-error";

export class AdminUserController {
    private adminUserService: AdminUserService;

    constructor(adminUserService: AdminUserService = new AdminUserService()) {
        this.adminUserService = adminUserService;
    }

    // Create new user (admin only)
    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: CreateUserDto = req.body;

            // Generate UID first (needed for profile picture naming)
            const uid = uuidv4();

            // Handle profile picture if uploaded
            let profilePicUrl = payload.profilePic;
            if (req.file) {
                const port = process.env.PORT || 5000;
                const ext = req.file.filename.split('.').pop();

                // Rename the file from pp-undefined.ext to pp-{uid}.ext
                const oldPath = req.file.path;
                const newFilename = `pp-${uid}.${ext}`;
                const newPath = path.join(path.dirname(oldPath), newFilename);

                // Rename the file
                fs.renameSync(oldPath, newPath);

                profilePicUrl = `http://localhost:${port}/public/profilePic/${newFilename}`;
            }

            // Apply default profile pic if none provided
            const finalProfilePicUrl = profilePicUrl || "https://i.pinimg.com/1200x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg";

            const created = await this.adminUserService.createUser(payload, finalProfilePicUrl, uid);
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
    getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.adminUserService.getAllUsers();
            sendSuccess(res, users);
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
            let profilePicUrl = req.body.profilePic;
            if (req.file) {
                const port = process.env.PORT || 5000;
                const ext = req.file.filename.split('.').pop();
                const user = await this.adminUserService.getUserById(id);
                if (user) {
                    const oldPath = req.file.path;
                    const newFilename = `pp-${user.uid}.${ext}`;
                    const newPath = path.join(path.dirname(oldPath), newFilename);
                    fs.renameSync(oldPath, newPath);

                    profilePicUrl = `http://localhost:${port}/public/profilePic/${newFilename}`;
                }
            }

            const updated = await this.adminUserService.updateUserById(id, req.body, profilePicUrl);
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

