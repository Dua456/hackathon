import twilio from 'twilio';
import { config } from '@silentsiren/config';
import { createLogger } from '@silentsiren/logger';
import { EmergencyAlert, GPSCoordinates } from '@silentsiren/shared-types';

const logger = createLogger('twilio-service');

class TwilioService {
  private client: twilio.Twilio | null = null;

  constructor() {
    if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
      this.client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
    } else {
      logger.warn('Twilio credentials not configured');
    }
  }

  async sendEmergencyAlert(
    phoneNumber: string,
    alert: EmergencyAlert
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client) {
      logger.error('Twilio client not initialized');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      const message = this.formatEmergencyMessage(alert);

      logger.info({ phoneNumber, eventId: alert.eventId }, 'Sending emergency SMS');

      const result = await this.client.messages.create({
        body: message,
        from: config.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      logger.info(
        { phoneNumber, messageId: result.sid, status: result.status },
        'SMS sent successfully'
      );

      return { success: true, messageId: result.sid };
    } catch (error) {
      logger.error({ error, phoneNumber }, 'Failed to send SMS');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendSMS(
    phoneNumber: string,
    message: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.client) {
      logger.error('Twilio client not initialized');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      logger.info({ phoneNumber }, 'Sending SMS');

      const result = await this.client.messages.create({
        body: message,
        from: config.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      logger.info(
        { phoneNumber, messageId: result.sid, status: result.status },
        'SMS sent successfully'
      );

      return { success: true, messageId: result.sid };
    } catch (error) {
      logger.error({ error, phoneNumber }, 'Failed to send SMS');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendBulkEmergencyAlerts(
    phoneNumbers: string[],
    alert: EmergencyAlert
  ): Promise<Array<{ phoneNumber: string; success: boolean; messageId?: string; error?: string }>> {
    const results = await Promise.allSettled(
      phoneNumbers.map((phoneNumber) => this.sendEmergencyAlert(phoneNumber, alert))
    );

    return results.map((result, index) => {
      const phoneNumber = phoneNumbers[index];
      if (result.status === 'fulfilled') {
        return { phoneNumber, ...result.value };
      } else {
        return {
          phoneNumber,
          success: false,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });
  }

  async sendEmergencyAlertWithRetry(
    phoneNumber: string,
    alert: EmergencyAlert,
    maxRetries: number = 3,
    retryDelay: number = 2000
  ): Promise<{ success: boolean; messageId?: string; error?: string; attempts: number }> {
    let lastError: string | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      logger.info({ phoneNumber, attempt, maxRetries }, 'Attempting SMS send');

      const result = await this.sendEmergencyAlert(phoneNumber, alert);

      if (result.success) {
        return { ...result, attempts: attempt };
      }

      lastError = result.error;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
      }
    }

    logger.error({ phoneNumber, maxRetries, error: lastError }, 'All SMS attempts failed');

    return {
      success: false,
      error: lastError || 'All retry attempts failed',
      attempts: maxRetries,
    };
  }

  private formatEmergencyMessage(alert: EmergencyAlert): string {
    const { userId, threatLevel, gpsCoordinates, timestamp, audioUrl } = alert;

    const googleMapsUrl = this.generateGoogleMapsUrl(gpsCoordinates);

    return `🚨 EMERGENCY ALERT 🚨

A trusted contact needs help!

Threat Level: ${threatLevel}
Time: ${timestamp.toLocaleString()}
Location: ${googleMapsUrl}

Audio Evidence: ${audioUrl || 'Processing...'}

This is an automated emergency alert from SilentSiren AI.
If this is a false alarm, please contact the user directly.

Emergency ID: ${alert.eventId}`;
  }

  private generateGoogleMapsUrl(coords: GPSCoordinates): string {
    return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  }

  async verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const lookup = await this.client.lookups.v2.phoneNumbers(phoneNumber).fetch();
      return lookup.valid || false;
    } catch (error) {
      logger.error({ error, phoneNumber }, 'Phone number verification failed');
      return false;
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}

export const twilioService = new TwilioService();
