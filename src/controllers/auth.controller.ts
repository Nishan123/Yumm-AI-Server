import { Request, Response } from "express";
import { ZodError } from "zod";
import { LoginDto, RegisterDto, GoogleAuthDto } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { auth } from "google-auth-library";


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
            const updates: any = { ...req.body };

            // Pass file to service if exists
            const file = req.file;

            const updated = await this.authService.updateUserProfile(id, updates, file);
            if (!updated) {
                sendError(res, "User not found", 404);
                return;
            }
            sendSuccess(res, updated, 200, "Profile updated successfully");
        } catch (error) {
            sendError(res, (error as Error).message, 400);
        }
    };

    sendResetPasswordEmail = async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const user = await this.authService.sendResetPasswordEmail(email);

            // Don't send back the user object for security privacy, just a success message
            sendSuccess(res, null, 200, "If the email is registered, a reset link has been sent.");
        } catch (error: any) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, error.message || "Internal Server Error", 500);
        }
    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const token = req.params.token;
            const { newPassword } = req.body;
            await this.authService.resetPassword(token, newPassword);

            sendSuccess(res, null, 200, "Password has been reset successfully.");

        } catch (error: any) {
            if (error instanceof HttpError) {
                sendError(res, error.message, error.statusCode);
                return;
            }
            sendError(res, error.message || "Internal Server Error", 500);
        }
    }
}

