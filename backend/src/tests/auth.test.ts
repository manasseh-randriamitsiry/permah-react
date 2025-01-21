import { describe, it, beforeAll, afterAll, beforeEach, expect } from '@jest/globals';
import { AuthService } from '../services/auth.service.js';
import { initTestDB, closeTestDB, resetTestDatabase } from '../config/test.config.js';
import { AppError } from '../utils/errors.js';

describe('Auth Service', () => {
  let authService: AuthService;

  beforeAll(async () => {
    await initTestDB();
    authService = new AuthService();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should register a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const result = await authService.register(userData);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe(userData.email);
  });

  it('should not register a user with existing email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    await authService.register(userData);

    await expect(async () => {
      await authService.register(userData);
    }).rejects.toThrow('User already exists');
  });

  it('should login user with correct credentials', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    await authService.register(userData);

    const credentials = {
      email: 'john@example.com',
      password: 'password123'
    };

    const result = await authService.login(credentials);
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
  });
}); 