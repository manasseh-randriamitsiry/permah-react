import { Router, RequestHandler } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const eventController = new EventController();

const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(eventController.getEvents.bind(eventController)));
router.get('/:id', asyncHandler(eventController.getEvent.bind(eventController)));
router.post('/', authenticate, asyncHandler(eventController.createEvent.bind(eventController)));
router.put('/:id', authenticate, asyncHandler(eventController.updateEvent.bind(eventController)));
router.delete('/:id', authenticate, asyncHandler(eventController.deleteEvent.bind(eventController)));
router.post('/:id/join', authenticate, asyncHandler(eventController.joinEvent.bind(eventController)));
router.delete('/:id/leave', authenticate, asyncHandler(eventController.leaveEvent.bind(eventController)));

export default router; 