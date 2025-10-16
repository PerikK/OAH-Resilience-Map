import { useEffect, useState } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { fetchAreaHistoricalWeather, getHourlyValue } from '../services/openMeteoService'

interface WeatherInfoBoxProps {
  lat: number
  lon: number
  date: string
  selectedMetrics: string[] // ['wind', 'rainfall', 'humidity', 'temperature']
}

interface WeatherValues {
  temperature?: number
  humidity?: number
  windSpeed?: number
  windDirection?: number
  precipitation?: number
}

export function WeatherInfoBox({ lat, lon, date, selectedMetrics }: WeatherInfoBoxProps) {
  const [weatherValues, setWeatherValues] = useState<WeatherValues>({})

  useEffect(() => {
    const fetchData = async () => {
      if (!lat || !lon || !date || selectedMetrics.length === 0) return

      try {
        const areaData = await fetchAreaHistoricalWeather(lat, lon, date, 1)
        
        if (!areaData || areaData.length === 0) {
          setWeatherValues({})
          return
        }

        const hourly = areaData[0].weatherData.hourly
        const hourIndex = 12 // Noon data

        const values: WeatherValues = {}

        if (selectedMetrics.includes('temperature')) {
          values.temperature = getHourlyValue(hourly.temperature_2m, hourIndex) || 0
        }
        if (selectedMetrics.includes('humidity')) {
          values.humidity = getHourlyValue(hourly.relative_humidity_2m, hourIndex) || 0
        }
        if (selectedMetrics.includes('wind')) {
          values.windSpeed = getHourlyValue(hourly.wind_speed_10m, hourIndex) || 0
          values.windDirection = getHourlyValue(hourly.wind_direction_10m, hourIndex) || 0
        }
        if (selectedMetrics.includes('rainfall')) {
          values.precipitation = hourly.precipitation?.reduce((acc: number, val: number) => acc + val, 0) || 0
        }

        setWeatherValues(values)
      } catch (error) {
        console.error('Failed to fetch weather data:', error)
        setWeatherValues({})
      }
    }

    fetchData()
  }, [lat, lon, date, selectedMetrics])

  if (!lat || !lon || !date || selectedMetrics.length === 0) {
    return null
  }

  // Get color based on temperature value for legend consistency
  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return '#0369A1' // Blue - Cold
    if (temp < 10) return '#0EA5E9' // Light blue - Cool
    if (temp < 20) return '#10B981' // Green - Mild
    if (temp < 25) return '#FDE047' // Yellow - Pleasant
    if (temp < 30) return '#F59E0B' // Orange - Warm
    return '#EF4444' // Red - Hot
  }

  const getHumidityColor = (humidity: number) => {
    if (humidity < 40) return '#7DD3FC' // Light blue - Dry
    if (humidity < 60) return '#3B82F6' // Blue - Moderate
    if (humidity < 80) return '#1E40AF' // Dark blue - Humid
    return '#1E3A8A' // Navy - Very humid
  }

  const getWindColor = (speed: number) => {
    if (speed < 2) return '#94A3B8' // Gray - Calm
    if (speed < 5) return '#86EFAC' // Light green - Light breeze
    if (speed < 10) return '#22C55E' // Green - Moderate
    if (speed < 15) return '#15803D' // Dark green - Strong
    return '#14532D' // Very dark green - Very strong
  }

  const getPrecipitationColor = (precip: number) => {
    if (precip < 2) return '#BAE6FD' // Very light blue - Light rain
    if (precip < 5) return '#7DD3FC' // Light blue - Moderate rain
    if (precip < 10) return '#3B82F6' // Blue - Heavy rain
    return '#1E40AF' // Dark blue - Very heavy rain
  }

  // Build the HTML for the info box
  const buildInfoBoxHTML = () => {
    const items: string[] = []

    if (weatherValues.temperature !== undefined) {
      const color = getTemperatureColor(weatherValues.temperature)
      items.push(`
        <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0;">
          <svg width="12" height="16" viewBox="0 0 16 20">
            <rect x="5" y="1" width="6" height="12" rx="3" fill="none" stroke="${color}" stroke-width="1.5"/>
            <circle cx="8" cy="16" r="3.5" fill="${color}"/>
            <line x1="8" y1="13" x2="8" y2="16" stroke="${color}" stroke-width="2"/>
          </svg>
          <span style="font-size: 11px; font-weight: 600; color: #1F2937;">${weatherValues.temperature.toFixed(1)}°C</span>
        </div>
      `)
    }

    if (weatherValues.humidity !== undefined) {
      const color = getHumidityColor(weatherValues.humidity)
      items.push(`
        <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0;">
          <svg width="12" height="12" viewBox="0 0 16 16">
            <path d="M 2,8 Q 4,6 6,8 T 10,8 T 14,8" 
                  fill="none" 
                  stroke="${color}" 
                  stroke-width="2" 
                  stroke-linecap="round"/>
          </svg>
          <span style="font-size: 11px; font-weight: 600; color: #1F2937;">${weatherValues.humidity.toFixed(0)}%</span>
        </div>
      `)
    }

    if (weatherValues.windSpeed !== undefined) {
      const color = getWindColor(weatherValues.windSpeed)
      items.push(`
        <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0;">
          <svg width="16" height="12" viewBox="0 0 20 16">
            <path d="M 2,8 L 16,8 L 12,4 M 16,8 L 12,12" 
                  fill="none" 
                  stroke="${color}" 
                  stroke-width="2" 
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
          <span style="font-size: 11px; font-weight: 600; color: #1F2937;">${weatherValues.windSpeed.toFixed(1)} m/s</span>
        </div>
      `)
    }

    if (weatherValues.precipitation !== undefined) {
      const color = getPrecipitationColor(weatherValues.precipitation)
      items.push(`
        <div style="display: flex; align-items: center; gap: 6px; padding: 2px 0;">
          <svg width="10" height="13" viewBox="0 0 12 16">
            <path d="M6 0 C6 0, 0 6, 0 9 C0 12, 2.7 15, 6 15 C9.3 15, 12 12, 12 9 C12 6, 6 0, 6 0 Z" 
                  fill="${color}" 
                  stroke="${color}" 
                  stroke-width="1"/>
          </svg>
          <span style="font-size: 11px; font-weight: 600; color: #1F2937;">${weatherValues.precipitation.toFixed(1)} mm</span>
        </div>
      `)
    }

    if (items.length === 0) {
      return '<div style="padding: 8px; font-size: 12px; color: #666;">Loading...</div>'
    }

    return `
      <div style="
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(4px);
        border-radius: 6px;
        padding: 6px 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        min-width: 100px;
      ">
        ${items.join('')}
      </div>
    `
  }

  return (
    <Marker
      position={[lat, lon]}
      icon={L.divIcon({
        html: buildInfoBoxHTML(),
        className: '',
        iconSize: [100, 80],
        iconAnchor: [50, 180], // Position box well outside and above the circle
      })}
    />
  )
}
