/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { City, Site } from '../mock_data/types'

export type HealthRiskMetric = 'pathogen' | 'fecal' | 'arg' | 'overall'
export type WeatherMetric = 'wind' | 'rainfall' | 'humidity'

export type SelectionContextValue = {
  city: City
  site: Site
  startDate: string
  endDate: string
  selectedHealthRisks: HealthRiskMetric[]
  selectedWeatherMetrics: WeatherMetric[]
  setCity: (c: City) => void
  setSite: (s: Site) => void
  setStartDate: (d: string) => void
  setEndDate: (d: string) => void
  setSelectedHealthRisks: (risks: HealthRiskMetric[]) => void
  setSelectedWeatherMetrics: (metrics: WeatherMetric[]) => void
  toggleHealthRisk: (risk: HealthRiskMetric) => void
  toggleWeatherMetric: (metric: WeatherMetric) => void
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>(null)
  const [site, setSite] = useState<Site>(null)
  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2025-07-31')
  const [selectedHealthRisks, setSelectedHealthRisks] = useState<HealthRiskMetric[]>([])
  const [selectedWeatherMetrics, setSelectedWeatherMetrics] = useState<WeatherMetric[]>([])

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

  const value = useMemo(
    () => ({
      city,
      site,
      startDate,
      endDate,
      selectedHealthRisks,
      selectedWeatherMetrics,
      setCity,
      setSite,
      setStartDate,
      setEndDate,
      setSelectedHealthRisks,
      setSelectedWeatherMetrics,
      toggleHealthRisk,
      toggleWeatherMetric,
    }),
    [city, site, startDate, endDate, selectedHealthRisks, selectedWeatherMetrics]
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider')
  return ctx
}
