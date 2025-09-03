import resilienceDataset from '../mock_data/Mock_Resilience_Dataset_2023_2025.json'

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
export const coimbraC1Data: ResilienceDataset = resilienceDataset as ResilienceDataset

// Get the latest data point for metrics
export const getLatestResilienceData = (): ResilienceDataPoint | null => {
  if (!coimbraC1Data.ResilienceData || coimbraC1Data.ResilienceData.length === 0) {
    return null
  }
  
  // Sort by date and get the most recent
  const sortedData = [...coimbraC1Data.ResilienceData].sort((a, b) => 
    new Date(b.Date).getTime() - new Date(a.Date).getTime()
  )
  
  return sortedData[0]
}

// Get time series data for charts
export const getTimeSeriesData = (metric: keyof ResilienceDataPoint): Array<{date: string, value: number}> => {
  if (!coimbraC1Data.ResilienceData) return []
  
  return coimbraC1Data.ResilienceData
    .map(point => ({
      date: point.Date,
      value: point[metric] as number
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Get aggregated metrics for cards
export const getAggregatedMetrics = () => {
  const latest = getLatestResilienceData()
  if (!latest) return null
  
  return {
    waterQuality: latest['Water Resources & Quality'],
    biodiversity: latest['Biodiversity & Habitats'],
    airQuality: latest['Air Quality'],
    ecosystemEngagement: latest['Ecosystem Engagement (%)'],
    maintained: latest['Maintained (%)'],
    climateAdaptation: latest['Climate Adaptation'],
    wasteReduction: latest['Waste Reduction']
  }
}

// Check if current selection matches available data
export const hasDataForSite = (city: string, siteNr: string): boolean => {
  return city === 'Coimbra' && siteNr === 'C1'
}
