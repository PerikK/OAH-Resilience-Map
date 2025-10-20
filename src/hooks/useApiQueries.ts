import { useQuery } from '@tanstack/react-query'
import { citiesService, sitesService, resilienceService } from '../services'
import type { CityDTO, ResearchSiteDTO, HealthRiskResponse, UrbanParametersResponse } from '../types/api'

/**
 * Query Keys
 * Centralized query key definitions for consistency
 */
export const queryKeys = {
  cities: ['cities'] as const,
  sites: ['sites'] as const,
  healthRisks: ['healthRisks'] as const,
  urbanParameters: ['urbanParameters'] as const,
}

/**
 * Hook to fetch all cities
 */
export function useCities() {
  return useQuery<CityDTO[], Error>({
    queryKey: queryKeys.cities,
    queryFn: () => citiesService.getAllCities(),
  })
}

/**
 * Hook to fetch all research sites
 */
export function useSites() {
  return useQuery<ResearchSiteDTO[], Error>({
    queryKey: queryKeys.sites,
    queryFn: () => sitesService.getAllSites(),
  })
}

/**
 * Hook to fetch health risk data
 */
export function useHealthRisks() {
  return useQuery<HealthRiskResponse[], Error>({
    queryKey: queryKeys.healthRisks,
    queryFn: () => resilienceService.getHealthRisks(),
  })
}

/**
 * Hook to fetch urban parameters data
 */
export function useUrbanParameters() {
  return useQuery<UrbanParametersResponse[], Error>({
    queryKey: queryKeys.urbanParameters,
    queryFn: () => resilienceService.getUrbanParameters(),
  })
}

/**
 * Derived data hooks - these use the cached data from the queries above
 */

/**
 * Get a specific city by ID
 */
export function useCityById(cityId: string | null) {
  const { data: cities } = useCities()
  if (!cityId || !cities) return undefined
  return cities.find(c => c.id === cityId)
}

/**
 * Get a specific site by code
 */
export function useSiteByCode(siteCode: string | null) {
  const { data: sites } = useSites()
  if (!siteCode || !sites) return undefined
  return sites.find(s => s.code === siteCode)
}

/**
 * Get all sites for a specific city
 */
export function useSitesByCity(cityId: string | null) {
  const { data: sites } = useSites()
  if (!cityId || !sites) return []
  return sites.filter(s => s.city.id === cityId)
}

/**
 * Get health risk data for a specific site
 */
export function useHealthRiskBySiteCode(siteCode: string | null) {
  const { data: healthRisks } = useHealthRisks()
  if (!siteCode || !healthRisks) return undefined
  return healthRisks.find(hr => hr.researchSiteCode === siteCode)
}

/**
 * Get urban parameters for a specific site
 */
export function useUrbanParametersBySiteCode(siteCode: string | null) {
  const { data: urbanParameters } = useUrbanParameters()
  if (!siteCode || !urbanParameters) return undefined
  return urbanParameters.find(up => up.researchSiteCode === siteCode)
}

// Helper functions to work with raw data (not hooks)
export const dataHelpers = {
  getSitesByCity: (sites: ResearchSiteDTO[] | undefined, cityId: string) => {
    if (!sites) return []
    return sites.filter(s => s.city.id === cityId)
  },
  getSiteByCode: (sites: ResearchSiteDTO[] | undefined, siteCode: string) => {
    if (!sites) return undefined
    return sites.find(s => s.code === siteCode)
  },
  getCityById: (cities: CityDTO[] | undefined, cityId: string) => {
    if (!cities) return undefined
    return cities.find(c => c.id === cityId)
  },
  getHealthRiskBySiteCode: (healthRisks: HealthRiskResponse[] | undefined, siteCode: string) => {
    if (!healthRisks) return undefined
    return healthRisks.find(hr => hr.researchSiteCode === siteCode)
  }
}
