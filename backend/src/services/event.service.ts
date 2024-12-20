import { AppDataSource } from '../config/typeorm.config.js';
import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import { EventCreate } from '../types/index.js';

export class EventService {
  private eventRepository = AppDataSource.getRepository(Event);
  private attendeeRepository = AppDataSource.getRepository(EventAttendee);

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(eventData);
    return this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['creator', 'attendees', 'attendees.user']
    });
  }

  async getEventById(eventId: number): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['creator', 'attendees', 'attendees.user']
    });
  }

  async updateEvent(eventId: number, updateData: Partial<Event>): Promise<Event | null> {
    await this.eventRepository.update(eventId, updateData);
    return this.getEventById(eventId);
  }

  async deleteEvent(eventId: number): Promise<void> {
    await this.eventRepository.delete(eventId);
  }

  async joinEvent(eventId: number, userId: number): Promise<Event> {
    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const attendeeCount = await this.attendeeRepository.count({
      where: { eventId }
    });

    if (attendeeCount >= event.available_places) {
      throw new Error('Event is full');
    }

    const attendee = this.attendeeRepository.create({
      eventId,
      userId
    });
    await this.attendeeRepository.save(attendee);

    const updatedEvent = await this.getEventById(eventId);
    if (!updatedEvent) throw new Error('Event not found');
    return updatedEvent;
  }

  async leaveEvent(eventId: number, userId: number): Promise<void> {
    await this.attendeeRepository.delete({
      eventId,
      userId
    });
  }
} 