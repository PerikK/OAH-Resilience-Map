// import resilienceDataset from '../mock_data/Mock_Resilience_Dataset_2023_2025.json'

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

// Placeholder - this file is no longer used
// All components now use health risk data from score_health_risks.csv
// This file can be safely deleted
