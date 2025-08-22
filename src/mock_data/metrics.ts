import type { City, Site } from './types'

export type Metric = {
  title: string
  value: string
  percentage: number
  subtitle: string
  color: string
  bgColor: string
}

const base: Metric[] = [
  {
    title: 'Water Resources & Quality',
    value: '29%',
    percentage: 29,
    subtitle: 'vs prev 15%',
    color: '#1e40af',
    bgColor: '#1e40af',
  },
  {
    title: 'Biodiversity & Habitats',
    value: '29%',
    percentage: 29,
    subtitle: 'vs prev 25%',
    color: '#7c3aed',
    bgColor: '#7c3aed',
  },
  {
    title: 'Riverbank Protection',
    value: '32.5%',
    percentage: 32.5,
    subtitle: 'vs prev 30%',
    color: '#0891b2',
    bgColor: '#0891b2',
  },
  {
    title: 'Air Quality',
    value: '10%',
    percentage: 10,
    subtitle: 'vs prev 8%',
    color: '#1f2937',
    bgColor: '#1f2937',
  },
  {
    title: 'Sustainable Land Use & Agriculture',
    value: '62%',
    percentage: 62,
    subtitle: 'vs prev 55%',
    color: '#312e81',
    bgColor: '#312e81',
  },
]

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const adjust = (arr: Metric[], delta: number): Metric[] =>
  arr.map(m => {
    const pct = clamp(Math.round(m.percentage + delta * 100), 0, 100)
    return { ...m, percentage: pct, value: `${pct}%` }
  })

export const metricsByCitySite: Record<City, Record<Site, Metric[]>> = {
  coimbra: {
    all: base,
    site1: adjust(base, 0.05),
    site2: adjust(base, -0.03),
  },
  lisbon: {
    all: adjust(base, 0.08),
    site1: adjust(base, 0.12),
    site2: adjust(base, 0.02),
  },
  porto: {
    all: adjust(base, -0.04),
    site1: adjust(base, -0.01),
    site2: adjust(base, -0.07),
  },
}

export const getMetrics = (city: City, site: Site): Metric[] =>
  metricsByCitySite[city]?.[site] ?? metricsByCitySite.coimbra.all
