import { Request, Response, NextFunction } from 'express';
import { Event } from '../entities/event.entity';
import { EventAttendee } from '../entities/event-attendee.entity';
import { AppDataSource } from '../config/typeorm.config';

export class EventController {
    private eventRepository = AppDataSource.getRepository(Event);
    private eventAttendeeRepository = AppDataSource.getRepository(EventAttendee);

    async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const events = await this.eventRepository.find({
                relations: ['creator', 'attendees']
            });
            res.json(events);
        } catch (error) {
            next(error);
        }
    }

    async getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const event = await this.eventRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ['creator', 'attendees']
            });
            
            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }
            
            res.json(event);
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
    
            const organizer_id = (req as any).user.id;
    
            const event = this.eventRepository.create({
                title,
                description,
                date: new Date(date),
                location,
                available_places: Number(available_places),
                price: Number(price),
                image_url,
                organizer_id,
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

    async joinEvent(req: Request, res: Response) {
        // Implementation
    }

    async leaveEvent(req: Request, res: Response) {
        // Implementation
    }
} 