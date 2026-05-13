import { apiClient } from './api';
import { EmergencyIncident, ValidationResult, UserReputation } from '@silentsiren/shared-types';

interface SubmitIncidentRequest {
  userId: string;
  deviceId: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  aiAnalysis: {
    confidence: number;
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    reasoning: string;
    audioPatterns?: string[];
  };
  audioClipUrl?: string;
}

interface SubmitIncidentResponse {
  incident: {
    id: string;
    status: string;
    timestamp: Date;
  };
  validation: ValidationResult;
  reputation: UserReputation;
  remainingQuota?: number;
}

interface ValidationStatusResponse {
  incident: {
    id: string;
    status: string;
    timestamp: Date;
    validationScore?: number;
  };
  validation: ValidationResult | null;
}

interface IncidentResponse {
  incident: EmergencyIncident;
}

interface ReputationResponse {
  reputation: UserReputation;
}

class ValidatorClient {
  /**
   * Submit a new emergency incident for community validation
   */
  async submitIncident(data: SubmitIncidentRequest): Promise<SubmitIncidentResponse> {
    const response = await apiClient.post<SubmitIncidentResponse>('/validator/submit', data);
    return response;
  }

  /**
   * Get validation status for an incident
   */
  async getValidationStatus(incidentId: string): Promise<ValidationStatusResponse> {
    const response = await apiClient.get<ValidationStatusResponse>(
      `/validator/status/${incidentId}`
    );
    return response;
  }

  /**
   * Get incident details
   */
  async getIncident(incidentId: string): Promise<IncidentResponse> {
    const response = await apiClient.get<IncidentResponse>(`/validator/incident/${incidentId}`);
    return response;
  }

  /**
   * Update user reputation after incident resolution
   */
  async updateReputation(
    userId: string,
    wasValidated: boolean,
    wasFalseAlarm: boolean
  ): Promise<ReputationResponse> {
    const response = await apiClient.post<ReputationResponse>('/validator/reputation/update', {
      userId,
      wasValidated,
      wasFalseAlarm,
    });
    return response;
  }

  /**
   * Get user reputation and statistics
   */
  async getUserReputation(userId: string): Promise<ReputationResponse> {
    const response = await apiClient.get<ReputationResponse>(`/validator/reputation/${userId}`);
    return response;
  }

  /**
   * Ban a user (admin only)
   */
  async banUser(
    userId: string,
    reason: string,
    durationSeconds?: number
  ): Promise<{ message: string; userId: string; duration: number }> {
    const response = await apiClient.post<{
      message: string;
      userId: string;
      duration: number;
    }>('/validator/ban', {
      userId,
      reason,
      durationSeconds,
    });
    return response;
  }

  /**
   * Unban a user (admin only)
   */
  async unbanUser(userId: string): Promise<{ message: string; userId: string }> {
    const response = await apiClient.post<{ message: string; userId: string }>('/validator/unban', {
      userId,
    });
    return response;
  }
}

export const validatorClient = new ValidatorClient();
