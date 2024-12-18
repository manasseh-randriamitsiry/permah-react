import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getEvents.bind(eventController));
router.get('/:id', eventController.getEvent.bind(eventController));
router.post('/', authenticate, eventController.createEvent.bind(eventController));
router.put('/:id', authenticate, eventController.updateEvent.bind(eventController));
router.delete('/:id', authenticate, eventController.deleteEvent.bind(eventController));
router.post('/:id/join', authenticate, eventController.joinEvent.bind(eventController));
router.delete('/:id/leave', authenticate, eventController.leaveEvent.bind(eventController));

export default router; 