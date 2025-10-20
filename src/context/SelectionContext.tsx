/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'

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
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function SelectionProvider({ children }: { children: ReactNode }) {
  // Selection state - UI state only, no API data
  const [city, setCity] = useState<City>(null)
  const [site, setSite] = useState<Site>(null)
  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2025-07-31')
  const [selectedHealthRisks, setSelectedHealthRisks] = useState<HealthRiskMetric[]>([])
  const [selectedWeatherMetrics, setSelectedWeatherMetrics] = useState<WeatherMetric[]>([])
  const [selectedUrbanParameters, setSelectedUrbanParameters] = useState<UrbanParameterMetric[]>([])
  const [selectedResilienceMetrics, setSelectedResilienceMetrics] = useState<ResilienceMetric[]>([])

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
  
  // Toggle functions for multi-select metrics

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
    ]
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider')
  return ctx
}
