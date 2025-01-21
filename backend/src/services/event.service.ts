import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import { getTestDataSource } from '../config/test.config.js';
import { AppDataSource } from '../config/typeorm.config.js';
import { EventCreate } from '../types/index.js';
import { AppError } from '../utils/errors.js';

export class EventService {
  private async getDataSource() {
    const dataSource = process.env.NODE_ENV === 'test' 
      ? await getTestDataSource()
      : AppDataSource;

    if (!dataSource) {
      throw new Error('Database connection not initialized');
    }

    return dataSource;
  }

  private async getEventRepository() {
    const dataSource = await this.getDataSource();
    return dataSource.getRepository(Event);
  }

  private async getAttendeeRepository() {
    const dataSource = await this.getDataSource();
    return dataSource.getRepository(EventAttendee);
  }

  async createEvent(eventData: EventCreate): Promise<Event> {
    try {
      const repository = await this.getEventRepository();
      const event = repository.create({
        ...eventData,
        organizer: eventData.organizer
      });
      
      return await repository.save(event);
    } catch (error) {
      console.error('Event creation error:', error);
      throw new AppError('Failed to create event', 500);
    }
  }

  async getEvents(): Promise<Event[]> {
    const repository = await this.getEventRepository();
    return repository.find({
      relations: ['creator', 'attendees', 'attendees.user']
    });
  }

  async getEventsByCreator(creatorId: number): Promise<Event[]> {
    const repository = await this.getEventRepository();
    return repository.find({
      where: { creator_id: creatorId },
      relations: ['creator', 'attendees', 'attendees.user']
    });
  }

  async getEventById(eventId: number): Promise<Event | null> {
    const repository = await this.getEventRepository();
    return repository.findOne({
      where: { id: eventId },
      relations: ['creator', 'attendees', 'attendees.user']
    });
  }

  async updateEvent(eventId: number, updateData: Partial<Event>, userId?: number): Promise<Event | null> {
    const repository = await this.getEventRepository();
    const event = await this.getEventById(eventId);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (userId && event.creator_id !== userId) {
      throw new AppError('Not authorized to update this event', 403);
    }

    await repository.update(eventId, updateData);
    return this.getEventById(eventId);
  }

  async deleteEvent(eventId: number, userId?: number): Promise<void> {
    const repository = await this.getEventRepository();
    const event = await this.getEventById(eventId);

    if (!event) {
      throw new AppError('Event not found', 404);
    }

    if (userId && event.creator_id !== userId) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    await repository.delete(eventId);
  }

  async joinEvent(eventId: number, userId: number): Promise<Event> {
    if (!userId || isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const attendeeRepository = await this.getAttendeeRepository();
    const attendeeCount = await attendeeRepository.count({
      where: { event: { id: eventId } }
    });

    if (attendeeCount >= event.available_places) {
      throw new Error('Event is full');
    }

    const existingAttendee = await attendeeRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId }
      }
    });

    if (existingAttendee) {
      throw new Error('Already attending this event');
    }

    const attendee = attendeeRepository.create({
      event: { id: eventId },
      user: { id: userId }
    });
    await attendeeRepository.save(attendee);

    const updatedEvent = await this.getEventById(eventId);
    if (!updatedEvent) throw new Error('Event not found');
    return updatedEvent;
  }

  async leaveEvent(eventId: number, userId: number): Promise<void> {
    const attendeeRepository = await this.getAttendeeRepository();
    await attendeeRepository.delete({
      event: { id: eventId },
      user: { id: userId }
    });
  }
} 