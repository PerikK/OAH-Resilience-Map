import type { City, Site } from './types'

export type EcosystemSlice = {
  name: string
  value: number
  color: string
}

const base: EcosystemSlice[] = [
  { name: 'Ecosystem Engaged', value: 40, color: '#4f46e5' },
  { name: 'Maintained', value: 60, color: '#8b5cf6' },
]

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const shift = (arr: EcosystemSlice[], delta: number): EcosystemSlice[] => {
  const engaged = clamp(arr[0].value + Math.round(delta * 100), 0, 90)
  const maintained = 100 - engaged
  return [
    { ...arr[0], value: engaged },
    { ...arr[1], value: maintained },
  ]
}

export const ecosystemByCitySite: Record<City, Record<Site, EcosystemSlice[]>> = {
  coimbra: {
    all: base,
    site1: shift(base, 0.05),
    site2: shift(base, -0.05),
  },
  lisbon: {
    all: shift(base, 0.1),
    site1: shift(base, 0.15),
    site2: shift(base, 0.05),
  },
  porto: {
    all: shift(base, -0.05),
    site1: shift(base, 0.02),
    site2: shift(base, -0.1),
  },
}

export const getEcosystemDistribution = (city: City, site: Site): EcosystemSlice[] =>
  ecosystemByCitySite[city]?.[site] ?? ecosystemByCitySite.coimbra.all
