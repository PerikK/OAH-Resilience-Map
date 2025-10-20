import { apiClient } from './api';
import type { HealthRiskResponse, UrbanParametersResponse } from '../types/api';

/**
 * Resilience Service
 * Handles all resilience map-related API calls (health risks and urban parameters)
 */
export const resilienceService = {
  /**
   * Get all health risks
   * @returns Promise<HealthRiskResponse[]>
   */
  getHealthRisks: async (): Promise<HealthRiskResponse[]> => {
    const response = await apiClient.get<HealthRiskResponse[]>('/resilience-map/health-risks');
    return response.data;
  },

  /**
   * Get all urban parameters
   * @returns Promise<UrbanParametersResponse[]>
   */
  getUrbanParameters: async (): Promise<UrbanParametersResponse[]> => {
    const response = await apiClient.get<UrbanParametersResponse[]>('/resilience-map/urban-parameters');
    return response.data;
  },
};
