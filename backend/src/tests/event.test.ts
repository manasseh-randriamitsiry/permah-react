import { describe, it, beforeAll, afterAll, beforeEach, expect } from '@jest/globals';
import { EventService } from '../services/event.service.js';
import { initTestDB, closeTestDB, resetTestDatabase } from '../config/test.config.js';
import { createTestUser, createTestEvent } from './helpers/test.helper.js';
import { AppError } from '../utils/errors.js';

describe('Event Service', () => {
  let eventService: EventService;
  let testUser: any;
  let testEvent: any;

  beforeAll(async () => {
    await initTestDB();
    eventService = new EventService();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    testUser = await createTestUser();
    testEvent = await createTestEvent(testUser.id);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create an event', async () => {
    const eventData = {
      title: 'New Event',
      description: 'Event Description',
      date: new Date(),
      location: 'Event Location',
      available_places: 100,
      price: 0,
      organizer_id: testUser.id
    };

    const event = await eventService.createEvent(eventData);
    expect(event).toBeDefined();
    expect(event.title).toBe(eventData.title);
  });

  it('should get event by id', async () => {
    const event = await eventService.getEventById(testEvent.id);
    expect(event).toBeDefined();
    expect(event?.id).toBe(testEvent.id);
  });

  it('should join event', async () => {
    const result = await eventService.joinEvent(testEvent.id, testUser.id);
    expect(result).toBeDefined();
    expect(result.attendees).toBeDefined();
  });
}); 