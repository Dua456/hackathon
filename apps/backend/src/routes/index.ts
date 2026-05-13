import { Router } from 'express';
import emergencyRoutes from './emergency';
import authRoutes from './auth';
import userRoutes from './user';
import aiRoutes from './ai';
import dispatchRoutes from './dispatch';
import validatorRoutes from './validator';
import healthRoutes from './health';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/user', userRoutes);
router.use('/ai', aiRoutes);
router.use('/dispatch', dispatchRoutes);
router.use('/validator', validatorRoutes);

export default router;
