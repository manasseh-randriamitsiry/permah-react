import mysql from 'mysql2/promise';
import { config } from './env';

export const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
});

export const connectDB = async (): Promise<void> => {
  try {
    // Test the connection
    await pool.getConnection();
    console.log('MySQL connected successfully');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
}; 