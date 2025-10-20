/**
 * API Response Types
 * These interfaces match the DTOs from the Kotlin backend
 */

export interface CityDTO {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
}

export interface ResearchSiteDTO {
  code: string;
  name: string;
  city: CityDTO;
  polygon: any | null; // GeoJSON object
  latitude: number;
  longitude: number;
  altitude: number | null;
}

export interface UserSiteDTO {
  userSiteCode: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
}

export interface HealthRiskResponse {
  id: number;
  researchSiteCode: string;
  samplingDate: string | null; // ISO date string
  scaledPathogenRisk: number;
  scaledFecalRisk: number;
  scaledArgRisk: number;
  healthRiskScore: number;
}

export interface UrbanParametersResponse {
  id: number;
  researchSiteCode: string;
  samplingDate: string | null; // ISO date string
  
  // Distance metrics
  distChampCulture: number | null;
  distanceToHospitals: number | null;
  distanceToLivingStreetRoad: number | null;
  distanceToMotorwayRoad: number | null;
  distanceToSewageStations: number | null;
  
  // Vegetation metrics at various radii
  patchDensityVeg50m: number | null;
  vegCoverFrac50m: number | null;
  patchDensityVeg100m: number | null;
  vegCoverFrac100m: number | null;
  patchDensityVeg250m: number | null;
  vegCoverFrac250m: number | null;
  patchDensityVeg500m: number | null;
  vegCoverFrac500m: number | null;
  patchDensityVeg750m: number | null;
  vegCoverFrac750m: number | null;
  patchDensityVeg1000m: number | null;
  vegCoverFrac1000m: number | null;
  patchDensityVeg1500m: number | null;
  vegCoverFrac1500m: number | null;
  patchDensityVeg2000m: number | null;
  vegCoverFrac2000m: number | null;
  
  // Patch density and human density metrics
  patchDensity50m: number | null;
  humanDensityProxy50m: number | null;
  patchDensity100m: number | null;
  humanDensityProxy100m: number | null;
  patchDensity250m: number | null;
  humanDensityProxy250m: number | null;
  patchDensity500m: number | null;
  humanDensityProxy500m: number | null;
  patchDensity750m: number | null;
  humanDensityProxy750m: number | null;
  patchDensity1000m: number | null;
  humanDensityProxy1000m: number | null;
  patchDensity1500m: number | null;
  humanDensityProxy1500m: number | null;
  patchDensity2000m: number | null;
  humanDensityProxy2000m: number | null;
  
  // Urban and impervious surface percentages
  urbanPct50m: number | null;
  urbanPct100m: number | null;
  urbanPct250m: number | null;
  urbanPct500m: number | null;
  urbanPct750m: number | null;
  urbanPct1000m: number | null;
  urbanPct1500m: number | null;
  urbanPct2000m: number | null;
  imperviousPct50m: number | null;
  imperviousPct100m: number | null;
  imperviousPct250m: number | null;
  imperviousPct500m: number | null;
  imperviousPct750m: number | null;
  imperviousPct1000m: number | null;
  imperviousPct1500m: number | null;
  imperviousPct2000m: number | null;
}

/**
 * Custom API Error
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
