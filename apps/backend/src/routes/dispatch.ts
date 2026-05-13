import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';
import { twilioService } from '../services/twilio.service';
import { createLogger } from '@silentsiren/logger';
import { z } from 'zod';

const router = Router();
const logger = createLogger('dispatch-routes');

const dispatchAlertSchema = z.object({
  eventId: z.string().min(1),
  threatLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  gpsCoordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().positive(),
  }),
  audioUrl: z.string().url().optional(),
  trustedContacts: z
    .array(
      z.object({
        name: z.string(),
        phoneNumber: z.string(),
        priority: z.number(),
      })
    )
    .max(3),
});

router.post('/alert', authenticate, strictRateLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const validation = dispatchAlertSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validation.error.errors,
        },
      });
    }

    const { eventId, threatLevel, gpsCoordinates, audioUrl, trustedContacts } = validation.data;

    logger.info({ userId: req.userId, eventId, threatLevel }, 'Emergency dispatch requested');

    if (!twilioService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'SMS service is not configured',
        },
      });
    }

    const alert = {
      eventId,
      userId: req.userId!,
      message: `Emergency alert from ${req.userId}`,
      gpsCoordinates: {
        ...gpsCoordinates,
        timestamp: new Date(),
      },
      audioUrl: audioUrl || '',
      threatLevel,
      timestamp: new Date(),
    };

    const phoneNumbers = trustedContacts
      .sort((a, b) => a.priority - b.priority)
      .map((contact) => contact.phoneNumber);

    const results = await twilioService.sendBulkEmergencyAlerts(phoneNumbers, alert);

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    logger.info(
      {
        userId: req.userId,
        eventId,
        successCount,
        failureCount,
        results,
      },
      'Emergency dispatch completed'
    );

    res.json({
      success: true,
      data: {
        eventId,
        dispatched: successCount,
        failed: failureCount,
        results: results.map((r) => ({
          phoneNumber: r.phoneNumber,
          success: r.success,
          messageId: r.messageId,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error, userId: req.userId }, 'Emergency dispatch failed');
    res.status(500).json({
      success: false,
      error: {
        code: 'DISPATCH_FAILED',
        message: 'Failed to dispatch emergency alert',
      },
    });
  }
});

router.post('/verify-phone', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PHONE_NUMBER',
          message: 'Phone number is required',
        },
      });
    }

    const isValid = await twilioService.verifyPhoneNumber(phoneNumber);

    res.json({
      success: true,
      data: {
        phoneNumber,
        isValid,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Phone verification failed');
    res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: 'Failed to verify phone number',
      },
    });
  }
});

export default router;
