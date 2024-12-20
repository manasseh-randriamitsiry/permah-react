import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.js';
import { AuthRequest } from '../types/index.js';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }

    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};