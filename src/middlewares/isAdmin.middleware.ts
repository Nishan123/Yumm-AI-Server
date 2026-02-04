import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { sendError } from '../utils/response.util';

// Extend Express Request to include user with role
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

export function isAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return sendError(res, 'Authentication required', 401);
    }

    if (req.user.role !== 'admin') {
        return sendError(res, 'Access denied. Admin privileges required.', 403);
    }

    return next();
}
