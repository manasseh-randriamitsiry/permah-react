import { Request, Response } from 'express';
import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import { AppDataSource } from '../config/typeorm.config.js';
import { AppError } from '../utils/errors.js';
import { EventService } from '../services/event.service.js';
import { AuthRequest } from '../types/index.js';

export class EventController {
    private eventRepository = AppDataSource.getRepository(Event);
    private attendeeRepository = AppDataSource.getRepository(EventAttendee);
    private eventService = new EventService();

    async getEvents(req: Request, res: Response) {
        try {
            const events = await this.eventService.getEvents();
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getEvent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(Number(id));
            
            if (!event) {
                throw new AppError('Event not found', 404);
            }

            res.json(event);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async createEvent(req: AuthRequest, res: Response) {
        try {
            const { 
                title, 
                description, 
                date, 
                location, 
                available_places, 
                price 
            } = req.body;

            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const event = this.eventRepository.create({
                title,
                description,
                date: new Date(date),
                location,
                available_places: Number(available_places),
                price: Number(price),
                organizer_id: req.user.id
            });

            const savedEvent = await this.eventRepository.save(event);
            res.status(201).json(savedEvent);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateEvent(req: AuthRequest, res: Response) {
        try {
            const eventId = req.params.id;
            const updateData = {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location,
                available_places: req.body.available_places
            };

            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const event = await this.eventRepository.findOne({
                where: { id: parseInt(eventId) }
            });

            if (!event) {
                throw new AppError('Event not found', 404);
            }

            if (event.organizer_id !== req.user.id) {
                throw new AppError('Not authorized to update this event', 403);
            }

            const updatedEvent = await this.eventRepository.save({
                ...event,
                ...updateData
            });

            res.json(updatedEvent);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async deleteEvent(req: Request, res: Response) {
        // Implementation
    }

    async joinEvent(req: AuthRequest, res: Response) {
        try {
            const { id: eventId } = req.params;
            
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const event = await this.eventService.joinEvent(Number(eventId), req.user.id);
            res.json(event);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async leaveEvent(req: AuthRequest, res: Response) {
        try {
            const { id: eventId } = req.params;
            
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            await this.eventService.leaveEvent(Number(eventId), req.user.id);
            res.status(200).json({ message: 'Successfully left the event' });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 