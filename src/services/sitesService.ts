import { apiClient } from './api';
import type { ResearchSiteDTO, UserSiteDTO } from '../types/api';

/**
 * Sites Service
 * Handles all research site-related API calls
 */
export const sitesService = {
  /**
   * Get all research sites
   * @returns Promise<ResearchSiteDTO[]>
   */
  getAllSites: async (): Promise<ResearchSiteDTO[]> => {
    const response = await apiClient.get<ResearchSiteDTO[]>('/sites/all');
    return response.data;
  },

  /**
   * Get research sites by city ID
   * @param cityId - The city ID
   * @returns Promise<ResearchSiteDTO[]>
   */
  getSitesByCity: async (cityId: string): Promise<ResearchSiteDTO[]> => {
    const response = await apiClient.get<ResearchSiteDTO[]>(`/sites/city/${cityId}`);
    return response.data;
  },

  /**
   * Get all user-generated sites
   * @returns Promise<UserSiteDTO[]>
   */
  getUserGeneratedSites: async (): Promise<UserSiteDTO[]> => {
    const response = await apiClient.get<UserSiteDTO[]>('/sites/user-generated');
    return response.data;
  },
};
