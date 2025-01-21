import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
const userController = new UserController();

router.get('/profile', authenticate, asyncHandler(userController.getProfile.bind(userController)));
router.put('/profile', authenticate, asyncHandler(userController.updateProfile.bind(userController)));

export default router; 