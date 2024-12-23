import { Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    try {
      const user = await userService.getProfile(req.user.userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to get profile' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    try {
      const user = await userService.updateProfile(req.user.userId, req.body);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update profile' });
    }
  }
} 