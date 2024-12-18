import { pool } from '../config/database';
import { IUser } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { RegisterData, LoginCredentials } from '../types';
import { ResultSetHeader } from 'mysql2';

export class AuthService {
  async register(userData: RegisterData) {
    const [existing] = await pool.execute<IUser[]>(
      'SELECT * FROM users WHERE email = ?',
      [userData.email]
    );
    
    if (existing.length) throw new Error('User already exists');

    const hashedPassword = await hashPassword(userData.password);
    await pool.execute(
      'INSERT INTO users (id, name, email, password) VALUES (UUID(), ?, ?, ?)',
      [userData.name, userData.email, hashedPassword]
    );

    const [user] = await pool.execute<IUser[]>(
      'SELECT id, name, email FROM users WHERE email = ?',
      [userData.email]
    );

    const token = generateToken(user[0].id);
    return { user: user[0], token };
  }

  async login(credentials: LoginCredentials) {
    const [users] = await pool.execute<IUser[]>(
      'SELECT * FROM users WHERE email = ?',
      [credentials.email]
    );
    
    const user = users[0];
    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await comparePassword(credentials.password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = generateToken(user.id);
    return { user: { ...user, password: undefined }, token };
  }
} 