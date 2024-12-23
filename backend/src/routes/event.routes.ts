import { Router, RequestHandler } from 'express';
import { EventController } from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
const eventController = new EventController();

const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Public routes
router.get('/', asyncHandler(eventController.getEvents.bind(eventController)));
router.get('/:id', asyncHandler(eventController.getEvent.bind(eventController)));

// Protected routes
router.post('/', authenticate, asyncHandler(eventController.createEvent.bind(eventController)));
router.put('/:id', authenticate, asyncHandler(eventController.updateEvent.bind(eventController)));
router.delete('/:id', authenticate, asyncHandler(eventController.deleteEvent.bind(eventController)));
router.post('/:id/join', authenticate, asyncHandler(eventController.joinEvent.bind(eventController)));
router.delete('/:id/leave', authenticate, asyncHandler(eventController.leaveEvent.bind(eventController)));

export default router; 