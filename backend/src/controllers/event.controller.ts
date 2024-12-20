import { Request, Response, NextFunction } from 'express';
import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import { AppDataSource } from '../config/typeorm.config.js';

export class EventController {
    private eventRepository = AppDataSource.getRepository(Event);
    private attendeeRepository = AppDataSource.getRepository(EventAttendee);

    async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const events = await this.eventRepository
                .createQueryBuilder('event')
                .leftJoinAndSelect('event.creator', 'creator')
                .leftJoinAndSelect('event.attendees', 'attendees')
                .leftJoinAndSelect('attendees.user', 'attendeeUser')
                .select([
                    'event',
                    'creator.id',
                    'creator.name',
                    'attendees',
                    'attendeeUser.id',
                    'attendeeUser.name'
                ])
                .getMany();

            // Transform the response to match the frontend expectations
            const transformedEvents = events.map(event => ({
                ...event,
                attendees: event.attendees.map(attendee => ({
                    id: attendee.user.id,
                    name: attendee.user.name
                }))
            }));

            console.log('Events with attendees:', JSON.stringify(transformedEvents, null, 2));
            res.json(transformedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            next(error);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const event = await this.eventRepository
                .createQueryBuilder('event')
                .leftJoinAndSelect('event.creator', 'creator')
                .leftJoinAndSelect('event.attendees', 'attendees')
                .leftJoinAndSelect('attendees.user', 'attendeeUser')
                .where('event.id = :id', { id })
                .select([
                    'event',
                    'creator.id',
                    'creator.name',
                    'attendees',
                    'attendeeUser.id',
                    'attendeeUser.name'
                ])
                .getOne();

            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }

            // Transform the response
            const transformedEvent = {
                ...event,
                attendees: event.attendees.map(attendee => ({
                    id: attendee.user.id,
                    name: attendee.user.name
                }))
            };

            res.json(transformedEvent);
        } catch (error) {
            next(error);
        }
    }

    async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, description, date, location, available_places, price, image_url } = req.body;
            
            // Validate required fields
            if (!title || !description || !date || !location || !available_places || price === undefined) {
                res.status(400).json({ 
                    message: "Missing required fields", 
                    required: {
                        title: !title,
                        description: !description,
                        date: !date,
                        location: !location,
                        available_places: !available_places,
                        price: price === undefined
                    }
                });
                return;
            }
    
            const userId = (req as any).user.userId;
    
            const event = this.eventRepository.create({
                title,
                description,
                date: new Date(date),
                location,
                available_places: Number(available_places),
                price: Number(price),
                image_url,
                organizer_id: userId,
                created_at: new Date()
            });
    
            await this.eventRepository.save(event);
            res.status(201).json(event);
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const eventId = req.params.id;
            const updateData = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location,
                maxAttendees: req.body.maxAttendees
            };

            const event = await this.eventRepository.findOne({
                where: { id: parseInt(eventId) }
            });

            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }

            // Check if user is the creator
            if (event.organizer_id !== (req as any).user.id) {
                res.status(403).json({ message: 'Not authorized to update this event' });
                return;
            }

            const updatedEvent = await this.eventRepository.save({
                ...event,
                ...updateData
            });

            res.json(updatedEvent);
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req: Request, res: Response) {
        // Implementation
    }

    async joinEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const eventId = parseInt(req.params.id);
            const userId = parseInt((req as any).user.id);

            const event = await this.eventRepository.findOne({
                where: { id: eventId },
                relations: ['attendees']
            });

            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }

            // Check if user is already attending
            const isAttending = await this.attendeeRepository.findOne({
                where: {
                    eventId,
                    userId
                }
            });

            if (isAttending) {
                res.status(400).json({ message: 'Already attending this event' });
                return;
            }

            // Create new attendee record
            const attendee = this.attendeeRepository.create({
                eventId,
                userId
            });

            await this.attendeeRepository.save(attendee);

            // Get updated event with attendees
            const updatedEvent = await this.eventRepository
                .createQueryBuilder('event')
                .leftJoinAndSelect('event.creator', 'creator')
                .leftJoinAndSelect('event.attendees', 'attendees')
                .leftJoinAndSelect('attendees.user', 'attendeeUser')
                .where('event.id = :id', { id: eventId })
                .getOne();

            res.json(updatedEvent);
        } catch (error) {
            next(error);
        }
    }

    async leaveEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const eventId = req.params.id;
            const userId = (req as any).user.id;

            const result = await this.attendeeRepository.delete({
                eventId: parseInt(eventId),
                userId: parseInt(userId)
            });

            if (result.affected === 0) {
                res.status(404).json({ message: 'Not attending this event' });
                return;
            }

            // Get updated event with attendees
            const updatedEvent = await this.eventRepository
                .createQueryBuilder('event')
                .leftJoinAndSelect('event.creator', 'creator')
                .leftJoinAndSelect('event.attendees', 'attendees')
                .leftJoinAndSelect('attendees.user', 'attendeeUser')
                .where('event.id = :id', { id: eventId })
                .getOne();

            res.json(updatedEvent);
        } catch (error) {
            next(error);
        }
    }
} 