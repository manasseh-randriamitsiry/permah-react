import { getTestDataSource, closeTestDB, resetTestDatabase } from '../config/test.config.js';
import './jest.setup.js';
import 'reflect-metadata';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await getTestDataSource();
});

beforeEach(async () => {
  await resetTestDatabase();
});

afterAll(async () => {
  await closeTestDB();
}); 