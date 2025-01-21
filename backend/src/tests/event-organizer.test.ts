import { describe, it, beforeAll, afterAll, beforeEach, expect } from '@jest/globals';
import { EventService } from '../services/event.service.js';
import { initTestDB, closeTestDB, resetTestDatabase } from '../config/test.config.js';
import { createTestUser, createTestEvent } from './helpers/test.helper.js';
import { AppError } from '../utils/errors.js';

describe('Event Organizer', () => {
  let eventService: EventService;
  let testUser: any;
  let testEvent: any;
  let anotherUser: any;

  beforeAll(async () => {
    await initTestDB();
    eventService = new EventService();
  });

  beforeEach(async () => {
    await resetTestDatabase();
    testUser = await createTestUser();
    anotherUser = await createTestUser('another@example.com');
    testEvent = await createTestEvent(testUser.id.toString(), testUser.id);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create event with correct organizer', async () => {
    const now = new Date();
    const eventData = {
      title: 'Organizer Test Event',
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
    expect(event.organizer).toBe(testUser.id.toString());
    expect(event.creator_id).toBe(testUser.id);
    expect(event.created_at).toBeDefined();
    expect(event.image_url).toBeDefined();
  });

  it('should get event with organizer details', async () => {
    const event = await eventService.getEventById(testEvent.id);
    expect(event).toBeDefined();
    expect(event?.organizer).toBe(testUser.id.toString());
    expect(event?.creator_id).toBe(testUser.id);
    expect(event?.creator).toBeDefined();
  });

  it('should not allow non-organizer to update event', async () => {
    await expect(async () => {
      await eventService.updateEvent(testEvent.id, {
        title: 'Updated Title'
      }, anotherUser.id.toString());
    }).rejects.toThrow('Not authorized to update this event');
  });

  it('should allow organizer to update event', async () => {
    const updatedTitle = 'Updated by Organizer';
    const updatedEvent = await eventService.updateEvent(testEvent.id, {
      title: updatedTitle
    }, testUser.id.toString());

    expect(updatedEvent).toBeDefined();
    expect(updatedEvent?.title).toBe(updatedTitle);
  });

  it('should create event with different organizer and creator', async () => {
    const now = new Date();
    const eventData = {
      title: 'Organizer Test Event',
      description: 'Event Description',
      date: now,
      location: 'Event Location',
      available_places: 100,
      price: 0,
      organizer: anotherUser.id.toString(),
      creator_id: testUser.id,
      image_url: 'https://example.com/test.jpg',
      created_at: now
    };

    const event = await eventService.createEvent(eventData);
    expect(event).toBeDefined();
    expect(event.organizer).toBe(anotherUser.id.toString());
    expect(event.creator_id).toBe(testUser.id);
    expect(event.created_at).toBeDefined();
    expect(event.image_url).toBeDefined();
  });

  it('should get event with both organizer and creator details', async () => {
    const event = await eventService.getEventById(testEvent.id);
    expect(event).toBeDefined();
    expect(event?.organizer).toBe(testUser.id.toString());
    expect(event?.creator_id).toBe(testUser.id);
    expect(event?.creator).toBeDefined();
    expect(event?.creator.id).toBe(testUser.id);
    expect(event?.creator.name).toBe('Test User');
  });

  it('should allow creator to update event regardless of organizer', async () => {
    const eventWithDiffOrganizer = await createTestEvent(anotherUser.id.toString(), testUser.id);
    
    const updatedTitle = 'Updated by Creator';
    const updatedEvent = await eventService.updateEvent(eventWithDiffOrganizer.id, {
      title: updatedTitle
    }, testUser.id);

    expect(updatedEvent).toBeDefined();
    expect(updatedEvent?.title).toBe(updatedTitle);
    expect(updatedEvent?.organizer).toBe(anotherUser.id.toString());
    expect(updatedEvent?.creator_id).toBe(testUser.id);
  });

  it('should not allow organizer to update event if not creator', async () => {
    const event = await createTestEvent(anotherUser.id.toString(), testUser.id);

    await expect(async () => {
      await eventService.updateEvent(event.id, {
        title: 'Updated Title'
      }, anotherUser.id);
    }).rejects.toThrow('Not authorized to update this event');
  });

  it('should allow creator to delete event regardless of organizer', async () => {
    const eventWithDiffOrganizer = await createTestEvent(anotherUser.id.toString(), testUser.id);
    
    await expect(async () => {
      await eventService.deleteEvent(eventWithDiffOrganizer.id, testUser.id);
    }).not.toThrow();

    const deletedEvent = await eventService.getEventById(eventWithDiffOrganizer.id);
    expect(deletedEvent).toBeNull();
  });

  it('should not allow organizer to delete event if not creator', async () => {
    const event = await createTestEvent(anotherUser.id.toString(), testUser.id);

    await expect(async () => {
      await eventService.deleteEvent(event.id, anotherUser.id);
    }).rejects.toThrow('Not authorized to delete this event');
  });
}); 