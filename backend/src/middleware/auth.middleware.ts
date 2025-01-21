import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors.js';
import { AuthRequest } from '../types/index.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AppError('Invalid token format', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number; email: string; name: string };
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        next(new AppError('Authentication failed', 401));
    }
};