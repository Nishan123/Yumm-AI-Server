import { Request, Response } from "express";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService = new AuthService()) {
        this.authService = authService;
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: RegisterDto = req.body;
            const result = await this.authService.register(payload);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload: LoginDto = req.body;
            const result = await this.authService.login(payload);
            res.status(200).json(result);
        } catch (error) {
            const status = (error as any).statusCode ?? 400;
            res.status(status).json({ message: (error as Error).message });
        }
    };
}
