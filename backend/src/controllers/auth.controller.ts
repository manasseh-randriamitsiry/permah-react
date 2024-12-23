import { Request, Response } from 'express';
import { User } from '../entities/user.entity.js';
import { AppDataSource } from '../config/typeorm.config.js';
import { comparePassword, hashPassword } from '../utils/password.utils.js';
import { generateToken } from '../utils/jwt.utils.js';

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await this.userRepository
                .createQueryBuilder('user')
                .select(['user.id', 'user.email'])
                .where('user.email = :email', { email })
                .getOne();

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const hashedPassword = await hashPassword(password);
            const user = this.userRepository.create({
                email,
                password: hashedPassword,
                name
            });

            await this.userRepository.save(user);

            // Generate token
            const token = generateToken(user.id);

            res.status(201).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Failed to register user' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await this.userRepository
                .createQueryBuilder('user')
                .select(['user.id', 'user.email', 'user.password', 'user.name'])
                .where('user.email = :email', { email })
                .getOne();

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate token
            const token = generateToken(user.id);

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Failed to login' });
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