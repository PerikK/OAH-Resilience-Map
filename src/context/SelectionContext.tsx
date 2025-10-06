/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { City, Site } from '../mock_data/types'

export type PollutantParameter = 'aqi' | 'pm2_5' | 'pm10' | 'o3'

export type SelectionContextValue = {
  city: City
  site: Site
  startDate: string
  endDate: string
  pollutant: PollutantParameter
  setCity: (c: City) => void
  setSite: (s: Site) => void
  setStartDate: (d: string) => void
  setEndDate: (d: string) => void
  setPollutant: (p: PollutantParameter) => void
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>(null)
  const [site, setSite] = useState<Site>(null)
  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2025-07-31')
  const [pollutant, setPollutant] = useState<PollutantParameter>('pm2_5')

  const value = useMemo(
    () => ({ city, site, startDate, endDate, pollutant, setCity, setSite, setStartDate, setEndDate, setPollutant }),
    [city, site, startDate, endDate, pollutant]
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider')
  return ctx
}
