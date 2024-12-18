import { RowDataPacket } from 'mysql2';

export interface IUser extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  name: string;
  membership_level: 'free' | 'paid';
  created_at: Date;
} 