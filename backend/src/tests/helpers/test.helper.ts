import { getTestDataSource } from '../../config/test.config.js';
import { User } from '../../entities/user.entity.js';
import { Event } from '../../entities/event.entity.js';
import { hashPassword } from '../../utils/password.utils.js';
import { AppError } from '../../utils/errors.js';
import { DataSource } from 'typeorm';

const getConnection = async (): Promise<DataSource> => {
  const dataSource = await getTestDataSource();
  if (!dataSource || !dataSource.isInitialized) {
    throw new AppError('Test database connection not initialized', 500);
  }
  return dataSource;
};

export const createTestUser = async (email: string = 'test@example.com') => {
  try {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    const hashedPassword = await hashPassword('testpass123');
    
    const user = userRepository.create({
      name: 'Test User',
      email: email,
      password: hashedPassword
    });
    
    return await userRepository.save(user);
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

export const createTestEvent = async (organizerId: string, creatorId: number) => {
  try {
    const connection = await getConnection();
    const eventRepository = connection.getRepository(Event);
    const now = new Date();
    
    const event = eventRepository.create({
      title: 'Test Event',
      description: 'Test Description',
      date: now,
      location: 'Test Location',
      available_places: 100,
      price: 0,
      organizer: organizerId,
      creator_id: creatorId,
      image_url: 'https://example.com/test.jpg',
      created_at: now
    });
    
    return await eventRepository.save(event);
  } catch (error) {
    console.error('Error creating test event:', error);
    throw error;
  }
};