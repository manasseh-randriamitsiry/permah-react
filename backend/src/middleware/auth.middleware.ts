import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ message: 'Invalid token' });
            return;
        }

        (req as any).user = user;
        next();
    });
};