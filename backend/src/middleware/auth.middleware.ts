import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthRequest } from '../types';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded.userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}; 