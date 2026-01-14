import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                fullName: string;
            };
        }
    }
}

export function authorizedMiddleWare(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            fullName: string;
        };
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
}
