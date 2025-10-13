# One Call API 3.0 Migration Guide

## Overview

The OpenWeather service has been refactored to use the **One Call API 3.0 timemachine endpoint** for fetching historical weather data. This provides access to weather data from January 1, 1979 to 4 days ahead.

## Changes Made

### 1. New TypeScript Interfaces

Added new interfaces to support the One Call API 3.0 response structure:

```typescript
// Weather condition details
export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

// Individual weather data point
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
  rain?: { '1h': number }
  snow?: { '1h': number }
}

// API response structure
export interface OneCallTimemachineResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  data: WeatherData[]
}

// Area weather point with metadata
export interface AreaWeatherPoint {
  lat: number
  lon: number
  weatherData: OneCallTimemachineResponse
  distance: number
  angle: number | null
  id: string
  timestamp: number
}
```

### 2. New Functions

#### `fetchHistoricalWeather(lat, lon, date)`

Fetches historical weather data for a single location and timestamp.

**Parameters:**

- `lat` (number): Latitude
- `lon` (number): Longitude  
- `date` (string | number): Date in YYYY-MM-DD format or Unix timestamp

**Returns:** `Promise<OneCallTimemachineResponse | null>`

**Example:**

```typescript
const weather = await fetchHistoricalWeather(40.19787, -8.42865, '2024-01-15')
if (weather) {
  console.log(`Temperature: ${weather.data[0].temp}°C`)
  console.log(`Humidity: ${weather.data[0].humidity}%`)
}
```

#### `fetchAreaHistoricalWeather(centerLat, centerLon, date, radiusKm)`

Fetches historical weather data for multiple points in a circular area using a polar grid pattern.

**Parameters:**

- `centerLat` (number): Center latitude
- `centerLon` (number): Center longitude
- `date` (string | number): Date in YYYY-MM-DD format or Unix timestamp
- `radiusKm` (number): Radius in kilometers (default: 10)

**Returns:** `Promise<AreaWeatherPoint[]>`

**Example:**

```typescript
const areaWeather = await fetchAreaHistoricalWeather(40.19787, -8.42865, '2024-01-15', 5)
console.log(`Fetched ${areaWeather.length} data points`)

// Calculate average temperature
const avgTemp = areaWeather.reduce((sum, point) => 
  sum + point.weatherData.data[0].temp, 0) / areaWeather.length
```

### 3. API Endpoint

The new endpoint uses:

```bash
https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={timestamp}&appid={API_KEY}&units=metric
```

**Key features:**

- Uses Unix timestamp for the `dt` parameter
- Supports `units` parameter (metric, imperial, standard)
- Returns comprehensive weather data including temperature, humidity, wind, clouds, visibility, etc.

### 4. Backward Compatibility

The original air pollution functions remain unchanged:

- `fetchHistoricalAirPollution()` - Still uses the free Air Pollution API
- `fetchAreaHistoricalAirPollution()` - Still fetches air pollution data for an area

## Testing

### Option 1: HTML Test Page

Open `test-onecall-api.html` in your browser:

1. Enter your OpenWeather API key
2. Set coordinates (default: Coimbra, Portugal)
3. Select a date
4. Click "Test API Call"

### Option 2: TypeScript Test Script

Run the test script:

```bash
npx tsx src/test-weather-service.ts
```

This will:

- Test single point weather fetch
- Test area weather fetch (multiple points)
- Display detailed results in the console

### Option 3: Integration in React Components

You can use the new functions in your React components:

```tsx
import { fetchHistoricalWeather, type OneCallTimemachineResponse } from './services/openWeatherService'

function WeatherComponent() {
  const [weather, setWeather] = useState<OneCallTimemachineResponse | null>(null)
  
  useEffect(() => {
    async function loadWeather() {
      const data = await fetchHistoricalWeather(40.19787, -8.42865, '2024-01-15')
      setWeather(data)
    }
    loadWeather()
  }, [])
  
  if (!weather) return <div>Loading...</div>
  
  return (
    <div>
      <h2>Weather Data</h2>
      <p>Temperature: {weather.data[0].temp}°C</p>
      <p>Humidity: {weather.data[0].humidity}%</p>
      <p>Wind: {weather.data[0].wind_speed} m/s</p>
    </div>
  )
}
```

## Important Notes

### API Key Requirements

⚠️ **The One Call API 3.0 requires a paid subscription** ("One Call by Call" plan)

- The free tier does NOT include access to this endpoint
- You need to subscribe at: ```bash https://openweathermap.org/price```
- Make sure your API key has the proper subscription activated

### Data Availability

- Historical data: From January 1, 1979
- Future forecast: Up to 4 days ahead
- Data is returned in hourly intervals

### Rate Limiting

Be mindful of API rate limits:

- The `fetchAreaHistoricalWeather()` function makes multiple API calls (one per grid point)
- Default grid has 81 points (1 center + 5 rings × 16 directions)
- Consider reducing the radius or implementing request throttling for production use

### Units

The API uses `units=metric` by default:

- Temperature: Celsius
- Wind speed: meter/sec
- Visibility: meters
- Pressure: hPa

To change units, modify the fetch URL in `fetchHistoricalWeather()`:

- `units=metric` - Celsius, meter/sec
- `units=imperial` - Fahrenheit, miles/hour
- `units=standard` - Kelvin, meter/sec (default)

## Migration Path

If you're currently using the air pollution API and want to switch to weather data:

1. **Update imports:**

   ```typescript
   // Old
   import { fetchHistoricalAirPollution } from './services/openWeatherService'
   
   // New
   import { fetchHistoricalWeather } from './services/openWeatherService'
   ```

2. **Update function calls:**  

   ```typescript
   // Old
   const airData = await fetchHistoricalAirPollution(lat, lon, date)
   const aqi = airData?.list[0]?.main?.aqi
   
   // New
   const weatherData = await fetchHistoricalWeather(lat, lon, date)
   const temp = weatherData?.data[0]?.temp
   ```

3. **Update component logic:**
   - Replace air quality metrics (AQI, PM2.5, etc.) with weather metrics (temp, humidity, wind)
   - Update UI to display weather data instead of pollution data
   - Adjust color scales and visualizations accordingly

## Troubleshooting

### Error: 401 Unauthorized

- Check that your API key is correct
- Verify your API key has One Call API 3.0 subscription

### Error: 403 Forbidden

- Your API key doesn't have access to One Call API 3.0
- Subscribe to the "One Call by Call" plan

### Error: 429 Too Many Requests

- You've exceeded your rate limit
- Implement request throttling or upgrade your plan

### No data returned (null)

- Check that coordinates are valid (-90 to 90 for lat, -180 to 180 for lon)
- Verify the date is within the supported range (1979-01-01 to 4 days ahead)
- Check console for error messages

## Resources

- [One Call API 3.0 Documentation](https://openweathermap.org/api/one-call-3)
- [OpenWeather Pricing](https://openweathermap.org/price)
- [API Key Management](https://home.openweathermap.org/api_keys)
- [Weather Condition Codes](https://openweathermap.org/weather-conditions)

## Files Modified

- `src/services/openWeatherService.ts` - Added new functions and interfaces
- `test-onecall-api.html` - HTML test page
- `src/test-weather-service.ts` - TypeScript test script
- `ONECALL_API_MIGRATION.md` - This documentation
