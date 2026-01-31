import { Request, Response } from "express";
import { ZodError } from "zod";
import { LoginDto, RegisterDto, GoogleAuthDto } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response.util";
import fs from "fs";
import path from "path";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService = new AuthService()) {
        this.authService = authService;
    }
    // Register Function 
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: RegisterDto = req.body;
            const result = await this.authService.register(payload);
            sendSuccess(res, result, 201);
        } catch (error) {
            if (error instanceof ZodError) {
                sendError(res, "Validation failed", 422, error.issues);
                return;
            }
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            console.error("Register error:", error);
            sendError(res, "Unexpected error", 500);
        }
    };


    // Login Function 
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: LoginDto = req.body;
            const result = await this.authService.login(payload);
            sendSuccess(res, result, 200);
        } catch (error) {
            if (error instanceof ZodError) {
                sendError(res, "Validation failed", 422, error.issues);
                return;
            }
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, "Unexpected error", 500);
        }
    };

    // Google Sign-In Function
    googleLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: GoogleAuthDto = req.body;
            const result = await this.authService.googleLogin(payload);
            sendSuccess(res, result, 200);
        } catch (error) {
            if (error instanceof ZodError) {
                sendError(res, "Validation failed", 422, error.issues);
                return;
            }
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, "Unexpected error", 500);
        }
    };

    // Update authenticated user profile
    updateAuthUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; // This is the user's UID

            // Handle profile picture if uploaded
            let profilePicUrl = req.body.profilePic;
            if (req.file) {
                const port = process.env.PORT || 5000;
                const ext = req.file.filename.split('.').pop();

                // Rename the file from pp-undefined.ext to pp-{uid}.ext
                const oldPath = req.file.path;
                const newFilename = `pp-${id}.${ext}`;
                const newPath = path.join(path.dirname(oldPath), newFilename);

                // Rename the file
                fs.renameSync(oldPath, newPath);

                profilePicUrl = `http://localhost:${port}/public/profilePic/${newFilename}`;
            }

            const updates: any = { ...req.body };
            if (profilePicUrl) {
                updates.profilePic = profilePicUrl;
            }

            const updated = await this.authService.updateUserProfile(id, updates);
            if (!updated) {
                sendError(res, "User not found", 404);
                return;
            }
            sendSuccess(res, updated, 200, "Profile updated successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 400);
        }
    };
}

