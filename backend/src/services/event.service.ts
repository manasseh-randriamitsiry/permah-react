import { AppDataSource } from '../config/typeorm.config';
import { Event } from '../entities/event.entity';
import { EventAttendee } from '../entities/event-attendee.entity';
import { EventCreate } from '../types';

export class EventService {
  private eventRepository = AppDataSource.getRepository(Event);
  private attendeeRepository = AppDataSource.getRepository(EventAttendee);

  async createEvent(eventData: EventCreate, organizerId: string): Promise<Event> {
    const event = this.eventRepository.create({
      ...eventData,
      organizer_id: organizerId
    });
    return this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['organizer']
    });
  }

  async getEventById(eventId: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['organizer', 'attendees']
    });
  }

  async updateEvent(eventId: string, updateData: Partial<Event>): Promise<Event | null> {
    await this.eventRepository.update(eventId, updateData);
    return this.getEventById(eventId);
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.eventRepository.delete(eventId);
  }

  async joinEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const attendeeCount = await this.attendeeRepository.count({
      where: { event_id: eventId }
    });

    if (attendeeCount >= event.available_places) {
      throw new Error('Event is full');
    }

    const attendee = this.attendeeRepository.create({
      event_id: eventId,
      user_id: userId
    });
    await this.attendeeRepository.save(attendee);

    const updatedEvent = await this.getEventById(eventId);
    if (!updatedEvent) throw new Error('Event not found');
    return updatedEvent;
  }

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    await this.attendeeRepository.delete({
      event_id: eventId,
      user_id: userId
    });
  }
} 