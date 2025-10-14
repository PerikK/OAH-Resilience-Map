import resilienceDataset from '../mock_data_TO_GO/Mock_Resilience_Dataset_2023_2025.json'

export interface ResilienceDataPoint {
  Date: string
  'Water Resources & Quality': number
  'Biodiversity & Habitats': number
  'Riverbank Protection': number
  'Air Quality': number
  'Sustainable Land Use & Agriculture': number
  'Waste Reduction': number
  'Natural Habitat': number
  'Climate Adaptation': number
  'Biodiversity': number
  'Water Quality': number
  'Ecosystem Engagement (%)': number
  'Maintained (%)': number
}

export interface ResilienceDataset {
  City: string
  Site: string
  ResilienceData: ResilienceDataPoint[]
}

// Load the resilience dataset
const dataset = resilienceDataset as ResilienceDataset

/**
 * Get resilience data for a specific site
 * Currently only Coimbra C1 Exploratório has real data
 * @param siteNr - Site number (e.g., "C1", "C2", etc.)
 * @returns Array of resilience data points or null if not found
 */
export function getResilienceDataForSite(siteNr: string): ResilienceDataPoint[] | null {
  // Check if this is the Coimbra C1 site (Exploratório)
  if (siteNr === 'C1' && dataset.Site === 'C1 Exploratório') {
    return dataset.ResilienceData
  }
  
  // For other sites, return null (no data available yet)
  return null
}

/**
 * Get the latest resilience metrics for a site
 * @param siteNr - Site number
 * @returns Latest data point or null
 */
export function getLatestResilienceData(siteNr: string): ResilienceDataPoint | null {
  const data = getResilienceDataForSite(siteNr)
  if (!data || data.length === 0) return null
  
  // Return the most recent data point
  return data[data.length - 1]
}

/**
 * Get resilience data filtered by date range
 * @param siteNr - Site number
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @returns Filtered array of resilience data points
 */
export function getResilienceDataByDateRange(
  siteNr: string,
  startDate: string,
  endDate: string
): ResilienceDataPoint[] {
  const data = getResilienceDataForSite(siteNr)
  if (!data) return []
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return data.filter(point => {
    const pointDate = new Date(point.Date)
    return pointDate >= start && pointDate <= end
  })
}

/**
 * Check if a site has resilience data available
 * @param siteNr - Site number
 * @returns true if data is available
 */
export function hasResilienceData(siteNr: string): boolean {
  return getResilienceDataForSite(siteNr) !== null
}
