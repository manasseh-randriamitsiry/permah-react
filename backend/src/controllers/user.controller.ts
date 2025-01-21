import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { AppError } from '../utils/errors.js';
import { AuthRequest } from '../types/index.js';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const user = await this.userService.getProfile(req.user.id);
            res.json(user);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const user = await this.userService.updateProfile(req.user.id, req.body);
            res.json(user);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 