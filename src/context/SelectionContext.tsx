/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { City, Site } from '../mock_data/types'

export type SelectionContextValue = {
  city: City
  site: Site
  setCity: (c: City) => void
  setSite: (s: Site) => void
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined)

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>('coimbra')
  const [site, setSite] = useState<Site>('all')

  const value = useMemo(() => ({ city, site, setCity, setSite }), [city, site])

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider')
  return ctx
}
