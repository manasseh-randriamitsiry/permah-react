import { Response } from 'express';
import { AuthRequest } from '../types';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export class EventController {
  async createEvent(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    try {
      const event = await eventService.createEvent(req.body, req.user.userId);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create event' });
    }
  }

  async getEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const events = await eventService.getEvents();
      res.status(200).json(events);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to get events' });
    }
  }

  async getEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to get event' });
    }
  }

  async updateEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to update event' });
    }
  }

  async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      await eventService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to delete event' });
    }
  }

  async joinEvent(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    try {
      const event = await eventService.joinEvent(req.params.id, req.user.userId);
      res.status(200).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to join event' });
    }
  }

  async leaveEvent(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    try {
      await eventService.leaveEvent(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to leave event' });
    }
  }
} 