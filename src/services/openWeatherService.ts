// OpenWeather API service for historical weather data using One Call API 3.0

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherData {
  dt: number
  sunrise?: number
  sunset?: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi?: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust?: number
  weather: WeatherCondition[]
  rain?: {
    '1h': number
  }
  snow?: {
    '1h': number
  }
}

export interface OneCallTimemachineResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  data: WeatherData[]
}

// Legacy interfaces for backward compatibility with air pollution data
export interface AirPollutionComponents {
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  nh3: number
}

export interface AirPollutionData {
  main: {
    aqi: number
  }
  components: AirPollutionComponents
  dt: number
}

export interface HistoricalAirPollutionResponse {
  coord: {
    lon: number
    lat: number
  }
  list: AirPollutionData[]
}

/**
 * Fetch historical weather data for a specific location and timestamp
 * Uses OpenWeather One Call API 3.0 timemachine endpoint
 * 
 * @param lat - Latitude
 * @param lon - Longitude
 * @param date - Date string in YYYY-MM-DD format or Unix timestamp
 * @returns Historical weather data
 */
export async function fetchHistoricalWeather(
  lat: number,
  lon: number,
  date: string | number
): Promise<OneCallTimemachineResponse | null> {
  if (!lat || !lon || !date) return null

  try {
    // Convert date string to Unix timestamp if needed
    let timestamp: number
    if (typeof date === 'string') {
      timestamp = Math.floor(new Date(date).getTime() / 1000)
    } else {
      timestamp = date
    }

    // One Call API 3.0 timemachine endpoint
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${OPENWEATHER_API_KEY}&units=metric`
    )

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
 * Fetch current air pollution data for a specific location
 * Uses OpenWeather Air Pollution API (free tier)
 * Note: This fetches current data, not historical. The date parameter is kept for API compatibility
 * but is not used since the free API doesn't support historical queries.
 * 
 * @param lat - Latitude
 * @param lon - Longitude
 * @param _date - Date string (not used, kept for compatibility)
 * @returns Current air pollution data
 */
export async function fetchHistoricalAirPollution(
  lat: number,
  lon: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _date: string
): Promise<HistoricalAirPollutionResponse | null> {
  if (!lat || !lon) return null

  try {
    // Using current air pollution API (free tier)
    // Historical data requires paid subscription to One Call API 3.0
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch air pollution data (${response.status})`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching air pollution data:', error)
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

export interface AreaAirPollutionPoint {
  lat: number
  lon: number
  airData: HistoricalAirPollutionResponse
  distance: number
  angle: number | null
  id: string
  timestamp: number
}

/**
 * Fetch historical air pollution data for multiple points in an area
 * 
 * @param centerLat - Center latitude
 * @param centerLon - Center longitude
 * @param date - Date string in YYYY-MM-DD format
 * @param radiusKm - Radius in kilometers (default: 10)
 * @returns Array of air pollution data points
 */
export async function fetchAreaHistoricalAirPollution(
  centerLat: number,
  centerLon: number,
  date: string,
  radiusKm: number = 10
): Promise<AreaAirPollutionPoint[]> {
  const gridPoints = generatePolarGridPoints(centerLat, centerLon, radiusKm)

  // Fetch data for all points in parallel, preserving metadata
  const promises = gridPoints.map((point) =>
    fetchHistoricalAirPollution(point.lat, point.lon, date)
      .then((result) => {
        if (result) {
          return {
            lat: point.lat,
            lon: point.lon,
            airData: result,
            distance: point.distance,
            angle: point.angle,
            id: point.id,
            timestamp: Date.now(),
          }
        }
        return null
      })
      .catch((err) => {
        console.warn(`Failed to fetch data for ${point.lat}, ${point.lon}:`, err)
        return null
      })
  )

  const results = await Promise.all(promises)

  // Filter out failed requests
  return results.filter((result): result is AreaAirPollutionPoint => result !== null)
}
