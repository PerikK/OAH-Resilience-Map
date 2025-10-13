import healthRiskCSV from './score_health_risks.csv?raw'

export interface HealthRiskData {
  Sample: string
  scaled_Pathogen_Risk: number
  scaled_Fecal_Risk: number
  scaled_ARG_Risk: number
  health_risk_score: number
}

// Parse CSV data
function parseCSV(csvText: string): HealthRiskData[] {
  const lines = csvText.trim().split('\n')
  // Skip header line
  return lines.slice(1).map(line => {
    const values = line.split(',')
    return {
      Sample: values[0],
      scaled_Pathogen_Risk: parseFloat(values[1]),
      scaled_Fecal_Risk: parseFloat(values[2]),
      scaled_ARG_Risk: parseFloat(values[3]),
      health_risk_score: parseFloat(values[4]),
    }
  })
}

// Load all health risk data
export const healthRiskData: HealthRiskData[] = parseCSV(healthRiskCSV)

// Get health risk data for a specific site
export function getHealthRiskForSite(siteNr: string): HealthRiskData | null {
  return healthRiskData.find(data => data.Sample === siteNr) || null
}

// Get all health risk data for a city
export function getHealthRiskForCity(cityPrefix: string): HealthRiskData[] {
  return healthRiskData.filter(data => data.Sample.startsWith(cityPrefix))
}

// Check if health risk data exists for a site
export function hasHealthRiskData(siteNr: string): boolean {
  return healthRiskData.some(data => data.Sample === siteNr)
}
