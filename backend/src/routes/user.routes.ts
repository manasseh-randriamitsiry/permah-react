import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/user', authenticate, userController.getProfile.bind(userController));
router.put('/user', authenticate, userController.updateProfile.bind(userController));
router.put('/user/membership', authenticate, userController.updateMembership.bind(userController));

export default router; 