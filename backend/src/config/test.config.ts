import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

let testDataSource: DataSource | null = null;

const createDataSource = () => {
  return new DataSource({
    type: 'mysql',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 3306,
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || 'root',
    database: process.env.TEST_DB_NAME || 'event_manager_test',
    entities: [User, Event, EventAttendee],
    synchronize: true,
    dropSchema: true,
    logging: false,
    extra: {
      connectionLimit: 1
    }
  });
};

export const initTestDB = async () => {
  try {
    if (!testDataSource) {
      testDataSource = createDataSource();
    }

    if (!testDataSource.isInitialized) {
      await testDataSource.initialize();
      await testDataSource.synchronize(true);
    }

    return testDataSource;
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
};

export const getTestDataSource = async () => {
  try {
    if (!testDataSource) {
      await initTestDB();
      return testDataSource;
    }

    if (!testDataSource.isInitialized) {
      testDataSource = createDataSource();
      await testDataSource.initialize();
      await testDataSource.synchronize(true);
    }

    return testDataSource;
  } catch (error) {
    console.error('Error getting test data source:', error);
    throw error;
  }
};

export const closeTestDB = async () => {
  try {
    if (testDataSource?.isInitialized) {
      await testDataSource.destroy();
    }
    testDataSource = null;
  } catch (error) {
    console.error('Error closing test database:', error);
    throw error;
  }
};

export const resetTestDatabase = async () => {
  try {
    await closeTestDB();
    await initTestDB();
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
};

export const seedTestData = async () => {
  if (!testDataSource || !testDataSource.isInitialized) return;
}; 