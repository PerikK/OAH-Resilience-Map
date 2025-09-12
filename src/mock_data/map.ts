import type { City, Site, CityKey, SiteKey } from './types'

export type MapPoint = {
  x: number
  y: number
  size: number
  value: number
}

const base: MapPoint[] = [
  { x: 120, y: 80, size: 8, value: 5 },
  { x: 180, y: 120, size: 12, value: 8 },
  { x: 220, y: 160, size: 16, value: 12 },
  { x: 160, y: 200, size: 10, value: 6 },
  { x: 280, y: 180, size: 14, value: 10 },
  { x: 200, y: 240, size: 6, value: 3 },
  { x: 140, y: 280, size: 20, value: 15 },
  { x: 260, y: 300, size: 8, value: 5 },
  { x: 100, y: 320, size: 12, value: 8 },
]

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const scale = (arr: MapPoint[], delta: number): MapPoint[] =>
  arr.map(p => ({
    ...p,
    size: clamp(Math.round(p.size * (1 + delta)), 3, 24),
    value: clamp(Math.round(p.value * (1 + delta * 1.5)), 0, 100),
  }))

export const mapByCitySite: Record<CityKey, Record<SiteKey, MapPoint[]>> = {
  coimbra: {
    all: base,
    site1: scale(base, 0.15),
    site2: scale(base, -0.1),
  },
  lisbon: {
    all: scale(base, 0.2),
    site1: scale(base, 0.3),
    site2: scale(base, 0.05),
  },
  porto: {
    all: scale(base, -0.05),
    site1: scale(base, 0.05),
    site2: scale(base, -0.2),
  },
}

export const getMapPoints = (city: City, site: Site): MapPoint[] => {
  if (!city || !site) return mapByCitySite.coimbra.all
  return mapByCitySite[city as CityKey]?.[site as SiteKey] ?? mapByCitySite.coimbra.all
}
