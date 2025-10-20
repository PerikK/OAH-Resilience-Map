/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CityDTO, ResearchSiteDTO, HealthRiskResponse, UrbanParametersResponse } from '../types/api'
import { citiesService, sitesService, resilienceService, handleApiError } from '../services'

// Type definitions for city and site selection
export type City = string | null  // City ID
export type Site = string | null  // Site code

export type HealthRiskMetric = 'pathogen' | 'fecal' | 'arg' | 'overall'
export type WeatherMetric = 'wind' | 'rainfall' | 'humidity' | 'temperature'
// Urban parameter categories for display
export type UrbanParameterMetric = 'vegetation' | 'urbanization' | 'imperviousSurface' | 'humanDensity' | 'distances'
export type ResilienceMetric = 'waterQuality' | 'biodiversity' | 'riverbankProtection' | 'airQuality' | 'landUse' | 'wasteReduction'

export type SelectionContextValue = {
  // Selection state
  city: City
  site: Site
  startDate: string
  endDate: string
  selectedHealthRisks: HealthRiskMetric[]
  selectedWeatherMetrics: WeatherMetric[]
  selectedUrbanParameters: UrbanParameterMetric[]
  selectedResilienceMetrics: ResilienceMetric[]
  
  // API data
  cities: CityDTO[]
  sites: ResearchSiteDTO[]
  healthRisks: HealthRiskResponse[]
  urbanParameters: UrbanParametersResponse[]
  
  // Loading states
  isLoadingCities: boolean
  isLoadingSites: boolean
  isLoadingHealthRisks: boolean
  isLoadingUrbanParameters: boolean
  
  // Error states
  citiesError: string | null
  sitesError: string | null
  healthRisksError: string | null
  urbanParametersError: string | null
  
  // Setters
  setCity: (c: City) => void
  setSite: (s: Site) => void
  setStartDate: (d: string) => void
  setEndDate: (d: string) => void
  setSelectedHealthRisks: (risks: HealthRiskMetric[]) => void
  setSelectedWeatherMetrics: (metrics: WeatherMetric[]) => void
  setSelectedUrbanParameters: (params: UrbanParameterMetric[]) => void
  setSelectedResilienceMetrics: (metrics: ResilienceMetric[]) => void
  toggleHealthRisk: (risk: HealthRiskMetric) => void
  toggleWeatherMetric: (metric: WeatherMetric) => void
  toggleUrbanParameter: (param: UrbanParameterMetric) => void
  toggleResilienceMetric: (metric: ResilienceMetric) => void
  
  // Helper functions
  getCityById: (id: string) => CityDTO | undefined
  getSiteByCode: (code: string) => ResearchSiteDTO | undefined
  getSitesByCity: (cityId: string) => ResearchSiteDTO[]
  getHealthRiskBySiteCode: (siteCode: string) => HealthRiskResponse | undefined
  getUrbanParametersBySiteCode: (siteCode: string) => UrbanParametersResponse | undefined
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function SelectionProvider({ children }: { children: ReactNode }) {
  // Selection state
  const [city, setCity] = useState<City>(null)
  const [site, setSite] = useState<Site>(null)
  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2025-07-31')
  const [selectedHealthRisks, setSelectedHealthRisks] = useState<HealthRiskMetric[]>([])
  const [selectedWeatherMetrics, setSelectedWeatherMetrics] = useState<WeatherMetric[]>([])
  const [selectedUrbanParameters, setSelectedUrbanParameters] = useState<UrbanParameterMetric[]>([])
  const [selectedResilienceMetrics, setSelectedResilienceMetrics] = useState<ResilienceMetric[]>([])
  
  // API data state
  const [cities, setCities] = useState<CityDTO[]>([])
  const [sites, setSites] = useState<ResearchSiteDTO[]>([])
  const [healthRisks, setHealthRisks] = useState<HealthRiskResponse[]>([])
  const [urbanParameters, setUrbanParameters] = useState<UrbanParametersResponse[]>([])
  
  // Loading states
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingSites, setIsLoadingSites] = useState(false)
  const [isLoadingHealthRisks, setIsLoadingHealthRisks] = useState(false)
  const [isLoadingUrbanParameters, setIsLoadingUrbanParameters] = useState(false)
  
  // Error states
  const [citiesError, setCitiesError] = useState<string | null>(null)
  const [sitesError, setSitesError] = useState<string | null>(null)
  const [healthRisksError, setHealthRisksError] = useState<string | null>(null)
  const [urbanParametersError, setUrbanParametersError] = useState<string | null>(null)
  
  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true)
      setCitiesError(null)
      try {
        const data = await citiesService.getAllCities()
        setCities(data)
      } catch (error) {
        const errorMessage = handleApiError(error)
        setCitiesError(errorMessage)
        console.error('Failed to fetch cities:', errorMessage)
      } finally {
        setIsLoadingCities(false)
      }
    }
    fetchCities()
  }, [])
  
  // Fetch sites on mount
  useEffect(() => {
    const fetchSites = async () => {
      setIsLoadingSites(true)
      setSitesError(null)
      try {
        const data = await sitesService.getAllSites()
        setSites(data)
      } catch (error) {
        const errorMessage = handleApiError(error)
        setSitesError(errorMessage)
        console.error('Failed to fetch sites:', errorMessage)
      } finally {
        setIsLoadingSites(false)
      }
    }
    fetchSites()
  }, [])
  
  // Fetch health risks on mount
  useEffect(() => {
    const fetchHealthRisks = async () => {
      setIsLoadingHealthRisks(true)
      setHealthRisksError(null)
      try {
        const data = await resilienceService.getHealthRisks()
        setHealthRisks(data)
      } catch (error) {
        const errorMessage = handleApiError(error)
        setHealthRisksError(errorMessage)
        console.error('Failed to fetch health risks:', errorMessage)
      } finally {
        setIsLoadingHealthRisks(false)
      }
    }
    fetchHealthRisks()
  }, [])
  
  // Fetch urban parameters on mount
  useEffect(() => {
    const fetchUrbanParameters = async () => {
      setIsLoadingUrbanParameters(true)
      setUrbanParametersError(null)
      try {
        const data = await resilienceService.getUrbanParameters()
        setUrbanParameters(data)
      } catch (error) {
        const errorMessage = handleApiError(error)
        setUrbanParametersError(errorMessage)
        console.error('Failed to fetch urban parameters:', errorMessage)
      } finally {
        setIsLoadingUrbanParameters(false)
      }
    }
    fetchUrbanParameters()
  }, [])

  const toggleHealthRisk = (risk: HealthRiskMetric) => {
    setSelectedHealthRisks(prev =>
      prev.includes(risk) ? prev.filter(r => r !== risk) : [...prev, risk]
    )
  }

  const toggleWeatherMetric = (metric: WeatherMetric) => {
    setSelectedWeatherMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    )
  }

  const toggleUrbanParameter = (param: UrbanParameterMetric) => {
    setSelectedUrbanParameters(prev =>
      prev.includes(param) ? prev.filter(p => p !== param) : [...prev, param]
    )
  }

  const toggleResilienceMetric = (metric: ResilienceMetric) => {
    setSelectedResilienceMetrics(prev =>
      prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
    )
  }
  
  // Helper functions
  const getCityById = (id: string): CityDTO | undefined => {
    return cities.find(c => c.id === id)
  }
  
  const getSiteByCode = (code: string): ResearchSiteDTO | undefined => {
    return sites.find(s => s.code === code)
  }
  
  const getSitesByCity = (cityId: string): ResearchSiteDTO[] => {
    return sites.filter(s => s.city.id === cityId)
  }
  
  const getHealthRiskBySiteCode = (siteCode: string): HealthRiskResponse | undefined => {
    return healthRisks.find(hr => hr.researchSiteCode === siteCode)
  }
  
  const getUrbanParametersBySiteCode = (siteCode: string): UrbanParametersResponse | undefined => {
    return urbanParameters.find(up => up.researchSiteCode === siteCode)
  }

  const value = useMemo(
    () => ({
      // Selection state
      city,
      site,
      startDate,
      endDate,
      selectedHealthRisks,
      selectedWeatherMetrics,
      selectedUrbanParameters,
      selectedResilienceMetrics,
      
      // API data
      cities,
      sites,
      healthRisks,
      urbanParameters,
      
      // Loading states
      isLoadingCities,
      isLoadingSites,
      isLoadingHealthRisks,
      isLoadingUrbanParameters,
      
      // Error states
      citiesError,
      sitesError,
      healthRisksError,
      urbanParametersError,
      
      // Setters
      setCity,
      setSite,
      setStartDate,
      setEndDate,
      setSelectedHealthRisks,
      setSelectedWeatherMetrics,
      setSelectedUrbanParameters,
      setSelectedResilienceMetrics,
      toggleHealthRisk,
      toggleWeatherMetric,
      toggleUrbanParameter,
      toggleResilienceMetric,
      
      // Helper functions
      getCityById,
      getSiteByCode,
      getSitesByCity,
      getHealthRiskBySiteCode,
      getUrbanParametersBySiteCode,
    }),
    [
      city, 
      site, 
      startDate, 
      endDate, 
      selectedHealthRisks, 
      selectedWeatherMetrics, 
      selectedUrbanParameters,
      selectedResilienceMetrics,
      cities,
      sites,
      healthRisks,
      urbanParameters,
      isLoadingCities,
      isLoadingSites,
      isLoadingHealthRisks,
      isLoadingUrbanParameters,
      citiesError,
      sitesError,
      healthRisksError,
      urbanParametersError,
    ]
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider')
  return ctx
}
