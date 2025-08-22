import type { City, Site } from './types'

export type ResilienceMonthlyPoint = {
  month: string
  current: number
  previous: number
}

const base: ResilienceMonthlyPoint[] = [
  { month: 'Jan 25', current: 0.75, previous: 0.65 },
  { month: 'Feb 25', current: 0.72, previous: 0.68 },
  { month: 'Mar 25', current: 0.85, previous: 0.78 },
  { month: 'Apr 25', current: 0.82, previous: 0.75 },
  { month: 'May 25', current: 1.05, previous: 0.95 },
  { month: 'Jun 25', current: 0.95, previous: 0.88 },
  { month: 'Jul 25', current: 0.88, previous: 0.82 },
]

const tweak = (arr: ResilienceMonthlyPoint[], delta: number): ResilienceMonthlyPoint[] =>
  arr.map(p => ({ ...p, current: +(p.current + delta).toFixed(2), previous: +(p.previous + delta * 0.8).toFixed(2) }))

export const resilienceByCitySite: Record<City, Record<Site, ResilienceMonthlyPoint[]>> = {
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

export const getResilienceMonthly = (city: City, site: Site): ResilienceMonthlyPoint[] =>
  resilienceByCitySite[city]?.[site] ?? resilienceByCitySite.coimbra.all
