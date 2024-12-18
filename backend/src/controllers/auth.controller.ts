import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Login failed' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Logout failed' });
    }
  }
} 