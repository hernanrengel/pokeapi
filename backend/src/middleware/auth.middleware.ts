import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}

/**
 * Middleware to authenticate requests using JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = AuthService.verifyToken(token);

        if (!payload) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        // Attach user info to request
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};
