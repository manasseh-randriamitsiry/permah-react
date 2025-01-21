import { AppDataSource } from '../config/typeorm.config.js';
import { User } from '../entities/user.entity.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import { RegisterData, LoginCredentials } from '../types/index.js';
import { AppError } from '../utils/errors.js';
import { getTestDataSource } from '../config/test.config.js';

export class AuthService {
  private async getDataSource() {
    return process.env.NODE_ENV === 'test' 
      ? await getTestDataSource()
      : AppDataSource;
  }

  async register(userData: RegisterData) {
    const dataSource = await this.getDataSource();
    const userRepository = dataSource.getRepository(User);

    const existing = await userRepository.findOne({
      where: { email: userData.email }
    });
    
    if (existing) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await hashPassword(userData.password);
    
    const user = userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword
    });

    const savedUser = await userRepository.save(user);
    const token = generateToken(savedUser.id);

    const { password, ...userWithoutPassword } = savedUser;
    return { user: userWithoutPassword, token };
  }

  async login(credentials: LoginCredentials) {
    const dataSource = await this.getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository
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
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user.id);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
} 