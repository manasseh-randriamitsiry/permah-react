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
    testEvent = await createTestEvent(testUser.id.toString(), testUser.id);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create an event', async () => {
    const now = new Date();
    const eventData = {
      title: 'New Event',
      description: 'Event Description',
      date: now,
      location: 'Event Location',
      available_places: 100,
      price: 0,
      organizer: testUser.id.toString(),
      creator_id: testUser.id,
      image_url: 'https://example.com/test.jpg',
      created_at: now
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

  it('should create an event with organizer', async () => {
    const now = new Date();
    const eventData = {
      title: 'New Event',
      description: 'Event Description',
      date: now,
      location: 'Event Location',
      available_places: 100,
      price: 0,
      organizer: testUser.id.toString(),
      creator_id: testUser.id,
      image_url: 'https://example.com/test.jpg',
      created_at: now
    };

    const event = await eventService.createEvent(eventData);
    expect(event).toBeDefined();
    expect(event.title).toBe(eventData.title);
    expect(event.organizer).toBe(testUser.id.toString());
    expect(event.creator_id).toBe(testUser.id);
  });

  it('should include organizer in event details', async () => {
    const event = await eventService.getEventById(testEvent.id);
    expect(event).toBeDefined();
    expect(event?.organizer).toBe(testUser.id.toString());
    expect(event?.creator_id).toBe(testUser.id);
    expect(event?.creator).toBeDefined();
  });

  it('should create an event with creator', async () => {
    const now = new Date();
    const eventData = {
      title: 'New Event',
      description: 'Event Description',
      date: now,
      location: 'Event Location',
      available_places: 100,
      price: 0,
      organizer: testUser.id.toString(),
      creator_id: testUser.id,
      image_url: 'https://example.com/test.jpg',
      created_at: now
    };

    const event = await eventService.createEvent(eventData);
    expect(event).toBeDefined();
    expect(event.title).toBe(eventData.title);
    expect(event.creator_id).toBe(testUser.id);
    expect(event.organizer).toBe(testUser.id.toString());
  });

  it('should get events by creator', async () => {
    // Create additional events with different creators
    const anotherUser = await createTestUser('another@example.com');
    await createTestEvent(anotherUser.id.toString(), anotherUser.id);
    await createTestEvent(anotherUser.id.toString(), anotherUser.id);
    
    // Get events by original test user
    const events = await eventService.getEventsByCreator(testUser.id);
    expect(events).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBe(1); // Should only get the event created in beforeEach
    expect(events[0].creator_id).toBe(testUser.id);
    expect(events[0].creator).toBeDefined();
    expect(events[0].creator.id).toBe(testUser.id);
  });

  it('should include creator details in event', async () => {
    const event = await eventService.getEventById(testEvent.id);
    expect(event).toBeDefined();
    expect(event?.creator).toBeDefined();
    expect(event?.creator.id).toBe(testUser.id);
    expect(event?.creator.name).toBe('Test User');
    expect(event?.creator.email).toBe('test@example.com');
  });

  it('should not allow non-creator to update event', async () => {
    const anotherUser = await createTestUser('another@example.com');
    const updateData = { title: 'Updated Title' };

    await expect(async () => {
      await eventService.updateEvent(testEvent.id, updateData, anotherUser.id);
    }).rejects.toThrow('Not authorized to update this event');
  });

  it('should allow creator to update event', async () => {
    const updateData = { title: 'Updated Title' };
    const updatedEvent = await eventService.updateEvent(testEvent.id, updateData, testUser.id);

    expect(updatedEvent).toBeDefined();
    expect(updatedEvent?.title).toBe('Updated Title');
    expect(updatedEvent?.creator_id).toBe(testUser.id);
  });

  it('should not allow non-creator to delete event', async () => {
    const anotherUser = await createTestUser('another@example.com');

    await expect(async () => {
      await eventService.deleteEvent(testEvent.id, anotherUser.id);
    }).rejects.toThrow('Not authorized to delete this event');
  });

  it('should allow creator to delete event', async () => {
    await expect(async () => {
      await eventService.deleteEvent(testEvent.id, testUser.id);
    }).not.toThrow();

    const deletedEvent = await eventService.getEventById(testEvent.id);
    expect(deletedEvent).toBeNull();
  });
}); 