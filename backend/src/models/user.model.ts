import { RowDataPacket } from 'mysql2';

export interface IUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  name: string;
  membership_level: 'free' | 'paid';
  created_at: Date;
} 