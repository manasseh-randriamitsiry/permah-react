import { AppDataSource } from '../config/typeorm.config.js';
import { User } from '../entities/user.entity.js';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getProfile(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'membership_level', 'created_at']
    });
  }

  async updateProfile(userId: number, updateData: Partial<User>) {
    const allowedUpdates = ['name', 'email'];
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedUpdates.includes(key))
    );
    
    if (Object.keys(filteredData).length === 0) return null;

    await this.userRepository.update(userId, filteredData);
    return this.getProfile(userId);
  }

  async updateMembership(userId: number, membershipLevel: 'free' | 'paid') {
    await this.userRepository.update(userId, { membership_level: membershipLevel });
    return this.getProfile(userId);
  }
} 