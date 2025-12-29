import { Request, Response } from "express";
import { ZodError } from "zod";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";
import { AuthService } from "../services/auth.service";

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
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422).json({ message: "Validation failed", issues: error.issues });
                return;
            }
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Unexpected error" });
        }
    };

    
    // Login Function 
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: LoginDto = req.body;
            const result = await this.authService.login(payload);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422).json({ message: "Validation failed", issues: error.issues });
                return;
            }
            if (error instanceof HttpError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Unexpected error" });
        }
    };
}
