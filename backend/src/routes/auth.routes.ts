import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));

export default router; 