import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.js';
import { AuthRequest } from '../types/index.js';

interface DecodedToken {
  userId: number;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token) as DecodedToken;
    
    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};