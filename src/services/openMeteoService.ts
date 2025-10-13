// Open-Meteo API service for historical weather and air quality data
// FREE - No API key required!

// Weather Data Interfaces
export interface WeatherData {
  time: string[]
  temperature_2m: number[]
  relative_humidity_2m: number[]
  wind_speed_10m: number[]
  wind_direction_10m: number[]
  cloud_cover: number[]
  precipitation?: number[]
  pressure_msl?: number[]
  weather_code?: number[]
}

export interface HistoricalWeatherResponse {
  latitude: number
  longitude: number
  elevation: number
  timezone: string
  hourly: WeatherData
  hourly_units: {
    temperature_2m: string
    relative_humidity_2m: string
    wind_speed_10m: string
    cloud_cover: string
  }
}

// Air Quality Data Interfaces
export interface AirQualityData {
  time: string[]
  pm10?: number[]
  pm2_5?: number[]
  ozone?: number[]
  nitrogen_dioxide?: number[]
  sulphur_dioxide?: number[]
  carbon_monoxide?: number[]
  european_aqi?: number[]
  us_aqi?: number[]
}

export interface AirQualityResponse {
  latitude: number
  longitude: number
  elevation: number
  timezone: string
  current?: {
    time: string
    european_aqi?: number
    us_aqi?: number
    pm10?: number
    pm2_5?: number
    ozone?: number
  }
  hourly?: AirQualityData
  hourly_units?: {
    pm10: string
    pm2_5: string
    ozone: string
    nitrogen_dioxide: string
    sulphur_dioxide: string
    carbon_monoxide: string
  }
}

/**
 * Fetch historical weather data for a specific location and date
 * Uses Open-Meteo Historical Weather API (FREE - no API key needed)
 * 
 * @param lat - Latitude
 * @param lon - Longitude
 * @param date - Date string in YYYY-MM-DD format
 * @returns Historical weather data
 */
export async function fetchHistoricalWeather(
  lat: number,
  lon: number,
  date: string
): Promise<HistoricalWeatherResponse | null> {
  if (!lat || !lon || !date) return null

  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?` +
      `latitude=${lat}&` +
      `longitude=${lon}&` +
      `start_date=${date}&` +
      `end_date=${date}&` +
      `hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation,pressure_msl,weather_code&` +
      `timezone=auto`

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch historical weather data (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching historical weather data:', error)
    return null
  }
}

/**
 * Fetch current and forecast air quality data
 * Uses Open-Meteo Air Quality API (FREE - no API key needed)
 * 
 * @param lat - Latitude
 * @param lon - Longitude
 * @param pastDays - Number of past days to include (default: 0)
 * @returns Air quality data
 */
export async function fetchAirQuality(
  lat: number,
  lon: number,
  pastDays: number = 0
): Promise<AirQualityResponse | null> {
  if (!lat || !lon) return null

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?` +
      `latitude=${lat}&` +
      `longitude=${lon}&` +
      `current=european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide&` +
      `hourly=pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,european_aqi,us_aqi&` +
      `timezone=auto` +
      (pastDays > 0 ? `&past_days=${pastDays}` : '')

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch air quality data (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching air quality data:', error)
    return null
  }
}

/**
 * Helper function to calculate new lat/lon given distance and bearing
 */
function calculateNewPosition(lat: number, lon: number, distanceKm: number, bearingDegrees: number) {
  const R = 6371 // Earth's radius in km
  const bearing = (bearingDegrees * Math.PI) / 180
  const lat1 = (lat * Math.PI) / 180
  const lon1 = (lon * Math.PI) / 180

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceKm / R) +
      Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(bearing)
  )

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distanceKm / R) * Math.cos(lat1),
      Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
    )

  return {
    lat: (lat2 * 180) / Math.PI,
    lon: (lon2 * 180) / Math.PI,
  }
}

/**
 * Generate points in a polar/circular pattern (concentric rings at specific angles)
 */
function generatePolarGridPoints(centerLat: number, centerLon: number, radiusKm: number = 10) {
  const points: Array<{ lat: number; lon: number; id: string; distance: number; angle: number | null }> = []

  // Define concentric rings (distances from center)
  const rings = [
    radiusKm * 0.2, // 20% of radius (inner ring)
    radiusKm * 0.4, // 40% of radius
    radiusKm * 0.6, // 60% of radius
    radiusKm * 0.8, // 80% of radius
    radiusKm * 1.0, // 100% of radius (outer ring)
  ]

  // Define angles (directions) - 8 main directions + 8 intermediate = 16 total
  const numAngles = 16
  const angleStep = 360 / numAngles

  // Add center point
  points.push({
    lat: centerLat,
    lon: centerLon,
    id: 'center',
    distance: 0,
    angle: null,
  })

  // Generate points in polar pattern
  rings.forEach((distance, ringIndex) => {
    for (let i = 0; i < numAngles; i++) {
      const angle = i * angleStep
      const newPos = calculateNewPosition(centerLat, centerLon, distance, angle)
      points.push({
        lat: newPos.lat,
        lon: newPos.lon,
        id: `r${ringIndex}-a${angle}`,
        distance: distance,
        angle: angle,
      })
    }
  })

  return points
}

export interface AreaWeatherPoint {
  lat: number
  lon: number
  weatherData: HistoricalWeatherResponse
  distance: number
  angle: number | null
  id: string
  timestamp: number
}

export interface AreaAirQualityPoint {
  lat: number
  lon: number
  airData: AirQualityResponse
  distance: number
  angle: number | null
  id: string
  timestamp: number
}

/**
 * Fetch historical weather data for multiple points in an area
 * Uses Open-Meteo Historical Weather API
 * 
 * Note: We fetch data once for the center point and reuse it for all grid points
 * since weather data doesn't vary significantly over a 1km radius
 * 
 * @param centerLat - Center latitude
 * @param centerLon - Center longitude
 * @param date - Date string in YYYY-MM-DD format
 * @param radiusKm - Radius in kilometers (default: 10)
 * @returns Array of weather data points
 */
export async function fetchAreaHistoricalWeather(
  centerLat: number,
  centerLon: number,
  date: string,
  radiusKm: number = 10
): Promise<AreaWeatherPoint[]> {
  // Fetch weather data once for the center point
  const centerWeatherData = await fetchHistoricalWeather(centerLat, centerLon, date)
  
  if (!centerWeatherData) {
    return []
  }

  // Generate grid points for visualization
  const gridPoints = generatePolarGridPoints(centerLat, centerLon, radiusKm)

  // Create area points using the same weather data for all points
  // This is reasonable since weather doesn't vary much over 1km
  const results: AreaWeatherPoint[] = gridPoints.map((point) => ({
    lat: point.lat,
    lon: point.lon,
    weatherData: centerWeatherData, // Reuse the same data
    distance: point.distance,
    angle: point.angle,
    id: point.id,
    timestamp: Date.now(),
  }))

  return results
}

/**
 * Fetch air quality data for multiple points in an area
 * Uses Open-Meteo Air Quality API
 * 
 * Note: We fetch data once for the center point and reuse it for all grid points
 * since air quality doesn't vary significantly over a 1km radius
 * 
 * @param centerLat - Center latitude
 * @param centerLon - Center longitude
 * @param radiusKm - Radius in kilometers (default: 10)
 * @param pastDays - Number of past days to include (default: 0)
 * @returns Array of air quality data points
 */
export async function fetchAreaAirQuality(
  centerLat: number,
  centerLon: number,
  radiusKm: number = 10,
  pastDays: number = 0
): Promise<AreaAirQualityPoint[]> {
  // Fetch air quality data once for the center point
  const centerAirData = await fetchAirQuality(centerLat, centerLon, pastDays)
  
  if (!centerAirData) {
    return []
  }

  // Generate grid points for visualization
  const gridPoints = generatePolarGridPoints(centerLat, centerLon, radiusKm)

  // Create area points using the same air quality data for all points
  // This is reasonable since air quality doesn't vary much over 1km
  const results: AreaAirQualityPoint[] = gridPoints.map((point) => ({
    lat: point.lat,
    lon: point.lon,
    airData: centerAirData, // Reuse the same data
    distance: point.distance,
    angle: point.angle,
    id: point.id,
    timestamp: Date.now(),
  }))

  return results
}

/**
 * Get the average value from an array of hourly data for a specific hour
 * @param hourlyData - Array of hourly values
 * @param hourIndex - Index of the hour to get (0-23, default: 12 for noon)
 */
export function getHourlyValue(hourlyData: number[] | undefined, hourIndex: number = 12): number | null {
  if (!hourlyData || hourlyData.length === 0) return null
  const index = Math.min(hourIndex, hourlyData.length - 1)
  return hourlyData[index]
}

/**
 * Get weather description from weather code
 * Based on WMO Weather interpretation codes
 */
export function getWeatherDescription(code: number | undefined): string {
  if (code === undefined) return 'Unknown'
  
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  
  return descriptions[code] || 'Unknown'
}
