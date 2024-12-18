import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.JWT_SECRET);
}; 