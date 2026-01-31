import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { sendError } from '../utils/response.util';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                fullName: string;
                role?: string;
            };
        }
    }
}

export function authorizedMiddleWare(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            fullName: string;
            role?: string;
        };
        req.user = decoded;
        return next();
    } catch (error) {
        return sendError(res, 'Invalid or expired token', 401);
    }
}
