import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';
import { createLogger } from '@silentsiren/logger';

const router = Router();
const logger = createLogger('emergency-routes');

router.post(
  '/trigger',
  authenticate,
  strictRateLimiter,
  async (req: AuthRequest, res: Response) => {
    try {
      logger.info({ userId: req.userId }, 'Emergency trigger received');

      res.json({
        success: true,
        data: {
          eventId: 'temp-event-id',
          status: 'ANALYZING',
          message: 'Emergency event created, analyzing audio',
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error({ error }, 'Emergency trigger failed');
      res.status(500).json({
        success: false,
        error: {
          code: 'EMERGENCY_TRIGGER_FAILED',
          message: 'Failed to process emergency trigger',
        },
      });
    }
  }
);

router.post('/cancel/:eventId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    logger.info({ userId: req.userId, eventId }, 'Emergency cancelled');

    res.json({
      success: true,
      data: {
        eventId,
        status: 'CANCELLED',
        message: 'Emergency event cancelled successfully',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Emergency cancellation failed');
    res.status(500).json({
      success: false,
      error: {
        code: 'CANCELLATION_FAILED',
        message: 'Failed to cancel emergency',
      },
    });
  }
});

export default router;
