import { AppDataSource } from '../config/typeorm.config';
import { Event } from '../entities/event.entity';
import { EventAttendee } from '../entities/event-attendee.entity';
import { EventCreate } from '../types';

export class EventService {
  private eventRepository = AppDataSource.getRepository(Event);
  private attendeeRepository = AppDataSource.getRepository(EventAttendee);

  async createEvent(eventData: EventCreate, creatorId: string): Promise<Event> {
    const event = this.eventRepository.create({
      ...eventData,
      organizer_id: creatorId
    });
    return this.eventRepository.save(event);
  }

  async getEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['creator']
    });
  }

  async getEventById(eventId: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: { id: parseInt(eventId) },
      relations: ['creator', 'attendees']
    });
  }

  async updateEvent(eventId: string, updateData: Partial<Event>): Promise<Event | null> {
    await this.eventRepository.update(
      { id: parseInt(eventId) },
      {
        title: updateData.title,
        description: updateData.description,
        date: updateData.date ? new Date(updateData.date) : undefined,
        location: updateData.location,
        available_places: updateData.available_places,
        price: updateData.price,
        image_url: updateData.image_url
      }
    );
    return this.getEventById(eventId);
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.eventRepository.delete(eventId);
  }

  async joinEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    const attendeeCount = await this.attendeeRepository.count({
      where: { eventId: parseInt(eventId) }
    });

    if (attendeeCount >= event.available_places) {
      throw new Error('Event is full');
    }

    const attendee = this.attendeeRepository.create({
      eventId: parseInt(eventId),
      userId: parseInt(userId)
    });
    await this.attendeeRepository.save(attendee);

    const updatedEvent = await this.getEventById(eventId);
    if (!updatedEvent) throw new Error('Event not found');
    return updatedEvent;
  }

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    await this.attendeeRepository.delete({
      eventId: parseInt(eventId),
      userId: parseInt(userId)
    });
  }
} 