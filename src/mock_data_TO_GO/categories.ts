import type { City, Site, CityKey, SiteKey } from './types'

export type CategoryBarPoint = {
  category: string
  dataset1: number
  dataset2: number
  dataset3: number
}

const base: CategoryBarPoint[] = [
  { category: 'Water Quality', dataset1: 85, dataset2: 75, dataset3: 65 },
  { category: 'Biodiversity', dataset1: 45, dataset2: 40, dataset3: 35 },
  { category: 'Climate Adaptation', dataset1: 70, dataset2: 65, dataset3: 60 },
  { category: 'Natural Habitat', dataset1: 60, dataset2: 55, dataset3: 50 },
  { category: 'Waste Reduction', dataset1: 80, dataset2: 70, dataset3: 40 },
]

const tweak = (arr: CategoryBarPoint[], delta: number): CategoryBarPoint[] =>
  arr.map(p => ({
    ...p,
    dataset1: Math.max(0, Math.min(100, p.dataset1 + Math.round(delta * 100))),
    dataset2: Math.max(0, Math.min(100, p.dataset2 + Math.round(delta * 80))),
    dataset3: Math.max(0, Math.min(100, p.dataset3 + Math.round(delta * 60))),
  }))

export const categoriesByCitySite: Record<CityKey, Record<SiteKey, CategoryBarPoint[]>> = {
  coimbra: {
    all: base,
    site1: tweak(base, 0.05),
    site2: tweak(base, -0.03),
  },
  lisbon: {
    all: tweak(base, 0.08),
    site1: tweak(base, 0.12),
    site2: tweak(base, 0.02),
  },
  porto: {
    all: tweak(base, -0.04),
    site1: tweak(base, -0.01),
    site2: tweak(base, -0.07),
  },
}

export const getCategoryBars = (city: City, site: Site): CategoryBarPoint[] => {
  if (!city || !site) return categoriesByCitySite.coimbra.all
  return categoriesByCitySite[city as CityKey]?.[site as SiteKey] ?? categoriesByCitySite.coimbra.all
}
