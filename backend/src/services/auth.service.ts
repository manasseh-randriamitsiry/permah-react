import { AppDataSource } from '../config/typeorm.config.js';
import { User } from '../entities/user.entity.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import { RegisterData, LoginCredentials } from '../types/index.js';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: RegisterData) {
    try {
      // Check if user exists
      const existing = await this.userRepository.findOne({
        where: { email: userData.email }
      });
      
      if (existing) throw new Error('User already exists');

      // Create new user
      const hashedPassword = await hashPassword(userData.password);
      
      console.log('Creating user with data:', {
        name: userData.name,
        email: userData.email,
        membership_level: 'free'
      });

      const user = this.userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        membership_level: 'free'
      });

      console.log('Created user instance:', user);
      console.log('User instance type:', typeof user);
      console.log('User ID before save:', user.id);

      // Let TypeORM handle the ID generation
      const savedUser = await this.userRepository.save(user);
      
      console.log('Saved user:', savedUser);
      console.log('Saved user ID:', savedUser.id);
      console.log('Saved user ID type:', typeof savedUser.id);

      // Generate token with the numeric ID
      const token = generateToken(savedUser.id);
      console.log('Generated token for ID:', savedUser.id);

      // Remove password from response
      const { password, ...userWithoutPassword } = savedUser;
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error stack:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials) {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email }
    });
    
    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = generateToken(user.id);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
} 