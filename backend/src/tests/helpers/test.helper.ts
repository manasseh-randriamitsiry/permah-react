import { getTestDataSource, closeTestDataSource, resetTestDatabase } from '../../config/test.config.js';
import { User } from '../../entities/user.entity.js';
import { Event } from '../../entities/event.entity.js';
import { hashPassword } from '../../utils/password.utils.js';

export {
  resetTestDatabase  // Export resetTestDatabase
};

export const initTestDB = async () => {
  const dataSource = await getTestDataSource();
  return dataSource;
};

export const closeTestDB = async () => {
  await closeTestDataSource();
};

export const createTestUser = async () => {
  const dataSource = await getTestDataSource();
  const userRepository = dataSource.getRepository(User);
  const hashedPassword = await hashPassword('testpass123');
  
  const user = userRepository.create({
    name: 'Test User',
    email: 'test@example.com',
    password: hashedPassword
  });
  
  return await userRepository.save(user);
};

export const createTestEvent = async (organizerId: number) => {
  const dataSource = await getTestDataSource();
  const eventRepository = dataSource.getRepository(Event);
  
  const event = eventRepository.create({
    title: 'Test Event',
    description: 'Test Description',
    date: new Date(),
    location: 'Test Location',
    available_places: 100,
    price: 0,
    organizer_id: organizerId
  });
  
  return await eventRepository.save(event);
}; 