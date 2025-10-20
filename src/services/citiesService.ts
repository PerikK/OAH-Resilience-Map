import { apiClient } from './api';
import type { CityDTO } from '../types/api';

/**
 * Cities Service
 * Handles all city-related API calls
 */
export const citiesService = {
  /**
   * Get all cities
   * @returns Promise<CityDTO[]>
   */
  getAllCities: async (): Promise<CityDTO[]> => {
    const response = await apiClient.get<CityDTO[]>('/cities/all');
    return response.data;
  },
};
