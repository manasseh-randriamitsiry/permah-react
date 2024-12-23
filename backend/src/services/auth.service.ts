import { AppDataSource } from '../config/typeorm.config.js';
import { User } from '../entities/user.entity.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import { RegisterData, LoginCredentials } from '../types/index.js';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: RegisterData) {
    try {
      const existing = await this.userRepository.findOne({
        where: { email: userData.email }
      });
      
      if (existing) throw new Error('User already exists');

      const hashedPassword = await hashPassword(userData.password);
      
      const user = this.userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });

      const savedUser = await this.userRepository.save(user);
      const token = generateToken(savedUser.id);

      const { password, ...userWithoutPassword } = savedUser;
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.password',
        'user.name',
        'user.created_at'
      ])
      .where('user.email = :email', { email: credentials.email })
      .getOne();
    
    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = generateToken(user.id);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
} 