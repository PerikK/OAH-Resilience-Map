# One Call API 3.0 - Quick Reference & Examples

## API Endpoint Format

```
https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}
```

## Example API Calls

### Basic Call (Coimbra, Portugal - January 15, 2024)

```bash
# Coordinates: 40.19787, -8.42865
# Date: 2024-01-15 (Unix timestamp: 1705276800)

curl "https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=40.19787&lon=-8.42865&dt=1705276800&appid=YOUR_API_KEY&units=metric"
```

### With Different Units

```bash
# Metric (Celsius, m/s)
curl "https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=40.19787&lon=-8.42865&dt=1705276800&appid=YOUR_API_KEY&units=metric"

# Imperial (Fahrenheit, mph)
curl "https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=40.19787&lon=-8.42865&dt=1705276800&appid=YOUR_API_KEY&units=imperial"

# Standard (Kelvin, m/s) - default
curl "https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=40.19787&lon=-8.42865&dt=1705276800&appid=YOUR_API_KEY"
```

## Example Response

```json
{
  "lat": 40.19787,
  "lon": -8.42865,
  "timezone": "Europe/Lisbon",
  "timezone_offset": 0,
  "data": [
    {
      "dt": 1705276800,
      "sunrise": 1705305600,
      "sunset": 1705341600,
      "temp": 12.5,
      "feels_like": 11.8,
      "pressure": 1013,
      "humidity": 75,
      "dew_point": 8.2,
      "uvi": 0.5,
      "clouds": 40,
      "visibility": 10000,
      "wind_speed": 3.5,
      "wind_deg": 180,
      "wind_gust": 5.2,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ]
    }
  ]
}
```

## TypeScript Usage Examples

### Example 1: Fetch Single Point Weather

```typescript
import { fetchHistoricalWeather } from './services/openWeatherService'

async function getWeather() {
  // Using date string
  const weather1 = await fetchHistoricalWeather(40.19787, -8.42865, '2024-01-15')
  
  // Using Unix timestamp
  const weather2 = await fetchHistoricalWeather(40.19787, -8.42865, 1705276800)
  
  if (weather1) {
    console.log(`Temperature: ${weather1.data[0].temp}°C`)
    console.log(`Humidity: ${weather1.data[0].humidity}%`)
    console.log(`Wind: ${weather1.data[0].wind_speed} m/s`)
    console.log(`Condition: ${weather1.data[0].weather[0].description}`)
  }
}
```

### Example 2: Fetch Area Weather (Multiple Points)

```typescript
import { fetchAreaHistoricalWeather } from './services/openWeatherService'

async function getAreaWeather() {
  // Fetch weather for 5km radius around Coimbra
  const areaWeather = await fetchAreaHistoricalWeather(
    40.19787,  // center latitude
    -8.42865,  // center longitude
    '2024-01-15',  // date
    5  // radius in km
  )
  
  console.log(`Fetched ${areaWeather.length} data points`)
  
  // Calculate average temperature
  const avgTemp = areaWeather.reduce((sum, point) => 
    sum + point.weatherData.data[0].temp, 0) / areaWeather.length
  
  console.log(`Average temperature: ${avgTemp.toFixed(2)}°C`)
  
  // Find hottest and coldest points
  const temps = areaWeather.map(p => ({
    temp: p.weatherData.data[0].temp,
    location: `${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`
  }))
  
  const hottest = temps.reduce((max, p) => p.temp > max.temp ? p : max)
  const coldest = temps.reduce((min, p) => p.temp < min.temp ? p : min)
  
  console.log(`Hottest: ${hottest.temp}°C at ${hottest.location}`)
  console.log(`Coldest: ${coldest.temp}°C at ${coldest.location}`)
}
```

### Example 3: React Component

```tsx
import React, { useState, useEffect } from 'react'
import { fetchHistoricalWeather, type OneCallTimemachineResponse } from './services/openWeatherService'

export function WeatherDisplay() {
  const [weather, setWeather] = useState<OneCallTimemachineResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true)
        const data = await fetchHistoricalWeather(40.19787, -8.42865, '2024-01-15')
        
        if (data) {
          setWeather(data)
        } else {
          setError('Failed to fetch weather data')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    loadWeather()
  }, [])
  
  if (loading) return <div>Loading weather data...</div>
  if (error) return <div>Error: {error}</div>
  if (!weather) return <div>No data available</div>
  
  const data = weather.data[0]
  
  return (
    <div className="weather-card">
      <h2>Weather for {weather.timezone}</h2>
      <div className="weather-details">
        <div className="weather-item">
          <span className="label">Temperature:</span>
          <span className="value">{data.temp}°C</span>
        </div>
        <div className="weather-item">
          <span className="label">Feels like:</span>
          <span className="value">{data.feels_like}°C</span>
        </div>
        <div className="weather-item">
          <span className="label">Humidity:</span>
          <span className="value">{data.humidity}%</span>
        </div>
        <div className="weather-item">
          <span className="label">Wind:</span>
          <span className="value">{data.wind_speed} m/s</span>
        </div>
        <div className="weather-item">
          <span className="label">Clouds:</span>
          <span className="value">{data.clouds}%</span>
        </div>
        <div className="weather-item">
          <span className="label">Pressure:</span>
          <span className="value">{data.pressure} hPa</span>
        </div>
        {data.weather && data.weather.length > 0 && (
          <div className="weather-item">
            <span className="label">Condition:</span>
            <span className="value">{data.weather[0].description}</span>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Example 4: Date Conversion Utilities

```typescript
// Convert date string to Unix timestamp
function dateToTimestamp(dateString: string): number {
  return Math.floor(new Date(dateString).getTime() / 1000)
}

// Convert Unix timestamp to readable date
function timestampToDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString()
}

// Usage
const timestamp = dateToTimestamp('2024-01-15')  // 1705276800
const date = timestampToDate(1705276800)  // "1/15/2024"

// Fetch weather using converted timestamp
const weather = await fetchHistoricalWeather(40.19787, -8.42865, timestamp)
```

## Common Weather Condition IDs

| ID Range | Main | Description |
|----------|------|-------------|
| 200-232 | Thunderstorm | Various thunderstorm conditions |
| 300-321 | Drizzle | Light rain conditions |
| 500-531 | Rain | Rain conditions |
| 600-622 | Snow | Snow conditions |
| 701-781 | Atmosphere | Mist, fog, haze, etc. |
| 800 | Clear | Clear sky |
| 801-804 | Clouds | Few clouds to overcast |

## Error Handling

```typescript
async function safeWeatherFetch(lat: number, lon: number, date: string) {
  try {
    const weather = await fetchHistoricalWeather(lat, lon, date)
    
    if (!weather) {
      console.error('No weather data returned')
      return null
    }
    
    if (!weather.data || weather.data.length === 0) {
      console.error('Weather data array is empty')
      return null
    }
    
    return weather
  } catch (error) {
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('401')) {
        console.error('Invalid API key')
      } else if (error.message.includes('403')) {
        console.error('API key does not have One Call API 3.0 access')
      } else if (error.message.includes('429')) {
        console.error('Rate limit exceeded')
      } else {
        console.error('Weather fetch error:', error.message)
      }
    }
    return null
  }
}
```

## Testing Checklist

- [ ] API key is valid and has One Call API 3.0 subscription
- [ ] Environment variable `VITE_OPENWEATHER_API_KEY` is set
- [ ] Coordinates are within valid ranges (lat: -90 to 90, lon: -180 to 180)
- [ ] Date is within supported range (1979-01-01 to 4 days ahead)
- [ ] Network connection is available
- [ ] CORS is properly configured (for browser requests)
- [ ] Rate limits are not exceeded

## Quick Test Command

```bash
# Test with curl (replace YOUR_API_KEY)
curl "https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=40.19787&lon=-8.42865&dt=1705276800&appid=YOUR_API_KEY&units=metric"

# Expected: JSON response with weather data
# Error 401: Invalid API key
# Error 403: No subscription to One Call API 3.0
```
