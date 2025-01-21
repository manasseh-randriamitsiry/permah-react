import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

let testDataSource: DataSource | null = null;

export const initTestDB = async () => {
  if (!testDataSource) {
    testDataSource = new DataSource({
      type: 'mysql',
      host: process.env.TEST_DB_HOST || 'localhost',
      port: Number(process.env.TEST_DB_PORT) || 3306,
      username: process.env.TEST_DB_USER || 'root',
      password: process.env.TEST_DB_PASSWORD || 'root',
      database: process.env.TEST_DB_NAME || 'event_manager_test',
      entities: [User, Event, EventAttendee],
      synchronize: true,
      dropSchema: true,
      logging: false
    });
  }

  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
    await testDataSource.synchronize();
  }

  return testDataSource;
};

export const getTestDataSource = async () => {
  if (!testDataSource || !testDataSource.isInitialized) {
    await initTestDB();
  }
  return testDataSource;
};

export const resetTestDatabase = async () => {
  if (testDataSource && testDataSource.isInitialized) {
    try {
      await testDataSource.synchronize(true);
      await seedTestData();
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }
};

export const seedTestData = async () => {
  if (!testDataSource || !testDataSource.isInitialized) return;
};

export const closeTestDB = async () => {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.destroy();
    testDataSource = null;
  }
}; 