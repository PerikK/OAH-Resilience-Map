import researchSitesData from '../mock_data/Research_Sites_All.json'

export interface ResearchSite {
  City: string
  'Site Nr.': string
  'Site Name': string
  Latitude: number
  Longitude: number
}

// Load all research sites from JSON
export const allResearchSites: ResearchSite[] = researchSitesData

// Get unique cities
export const getUniqueCities = (): string[] => {
  const cities = [...new Set(allResearchSites.map(site => site.City))]
  return cities.sort()
}

// Get sites for a specific city
export const getSitesByCity = (cityName: string): ResearchSite[] => {
  return allResearchSites.filter(site => site.City === cityName)
}

// Get city coordinates (center of all sites in that city)
export const getCityCoordinates = (cityName: string): { lat: number, lng: number } => {
  const citySites = getSitesByCity(cityName)
  if (citySites.length === 0) {
    return { lat: 0, lng: 0 }
  }
  
  const avgLat = citySites.reduce((sum, site) => sum + site.Latitude, 0) / citySites.length
  const avgLng = citySites.reduce((sum, site) => sum + site.Longitude, 0) / citySites.length
  
  return { lat: avgLat, lng: avgLng }
}

// Get a specific site by city and site number
export const getSite = (cityName: string, siteNr: string): ResearchSite | undefined => {
  return allResearchSites.find(site => site.City === cityName && site['Site Nr.'] === siteNr)
}
