import { pool } from '../config/database';
import { IUser } from '../models/user.model';

export class UserService {
  async getProfile(userId: string) {
    const [rows] = await pool.execute<IUser[]>(
      'SELECT id, email, name FROM users WHERE id = ?',
      [userId]
    );
    return rows[0] || null;
  }

  async updateProfile(userId: string, updateData: Partial<IUser>) {
    const allowedUpdates = ['name', 'email'];
    const updates = Object.entries(updateData)
      .filter(([key]) => allowedUpdates.includes(key))
      .map(([key, value]) => `${key} = ?`);
    
    if (updates.length === 0) return null;

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `;

    const values = [
      ...Object.entries(updateData)
        .filter(([key]) => allowedUpdates.includes(key))
        .map(([_, value]) => value),
      userId
    ];

    await pool.execute(query, values);
    return this.getProfile(userId);
  }

  async updateMembership(userId: string, membershipLevel: 'free' | 'paid') {
    await pool.execute(
      'UPDATE users SET membership_level = ? WHERE id = ?',
      [membershipLevel, userId]
    );
    return this.getProfile(userId);
  }
} 