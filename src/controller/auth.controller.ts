import { Request, Response } from "express";
import { ZodError } from "zod";
import { LoginDto, RegisterDto, GoogleAuthDto } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response.util";

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
}

