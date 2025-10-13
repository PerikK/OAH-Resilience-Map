import { useState, useEffect } from 'react'
import { Circle, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { fetchAreaHistoricalWeather, getHourlyValue, getWeatherDescription, type AreaWeatherPoint } from '../services/openMeteoService'

interface WeatherLayerProps {
  lat: number
  lon: number
  date: string
  parameter?: 'temp' | 'humidity' | 'wind_speed' | 'clouds'
}

export function WeatherLayer({ lat, lon, date, parameter = 'temp' }: WeatherLayerProps) {
  const [areaDataPoints, setAreaDataPoints] = useState<AreaWeatherPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [averageValue, setAverageValue] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [windData, setWindData] = useState<{ speed: number; direction: number } | null>(null)
  const [precipitationData, setPrecipitationData] = useState<number>(0) // Total precipitation in mm

  useEffect(() => {
    const fetchData = async () => {
      if (!lat || !lon || !date) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch weather data for the center point only
        const areaData = await fetchAreaHistoricalWeather(lat, lon, date, 1)
        
        if (!areaData || areaData.length === 0) {
          setError('No weather data available.')
          setAreaDataPoints([])
          setAverageValue(null)
          return
        }
        
        setAreaDataPoints(areaData)

        // Log complete weather data for demonstration
        console.log('=== COMPLETE WEATHER DATA ===')
        console.log('Location:', { lat, lon })
        console.log('Date:', date)
        console.log('Full API Response:', JSON.stringify(areaData[0].weatherData, null, 2))
        console.log('Available hours:', areaData[0].weatherData.hourly.time.length)
        console.log('============================')

        // Get value for the parameter (using noon data - index 12)
        const hourly = areaData[0].weatherData.hourly
        let value: number
        switch (parameter) {
          case 'temp':
            value = getHourlyValue(hourly.temperature_2m, 12) || 0
            break
          case 'humidity':
            value = getHourlyValue(hourly.relative_humidity_2m, 12) || 0
            break
          case 'wind_speed':
            value = getHourlyValue(hourly.wind_speed_10m, 12) || 0
            break
          case 'clouds':
            value = getHourlyValue(hourly.cloud_cover, 12) || 0
            break
          default:
            value = getHourlyValue(hourly.temperature_2m, 12) || 0
        }
        setAverageValue(value)

        // Get wind data for arrows
        const windSpeed = getHourlyValue(hourly.wind_speed_10m, 12) || 0
        const windDirection = getHourlyValue(hourly.wind_direction_10m, 12) || 0
        setWindData({ speed: windSpeed, direction: windDirection })

        // Get precipitation data (sum of all hourly precipitation)
        const totalPrecipitation = hourly.precipitation?.reduce((acc: number, val: number) => acc + val, 0) || 0
        setPrecipitationData(totalPrecipitation)

        console.log('=== WEATHER SYMBOLS DATA ===')
        console.log('Wind Speed:', windSpeed, 'm/s')
        console.log('Wind Direction:', windDirection, '° (0=N, 90=E, 180=S, 270=W)')
        console.log('Total Precipitation:', totalPrecipitation, 'mm')
        console.log('Humidity:', parameter === 'humidity' ? value : 'N/A', '%')
        console.log('============================')
      } catch (error) {
        console.error('Failed to fetch weather data:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch weather data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [lat, lon, date, parameter])

  // Get gradient color based on parameter value
  // const getGradientColor = (value: number, param: string) => {
  //   if (param === 'temp') {
  //     // Temperature: Blue (cold) to Red (hot) (-10°C to 40°C)
  //     if (value < 0) return '#1E3A8A' // Very cold - Navy
  //     if (value < 10) return '#3B82F6' // Cold - Blue
  //     if (value < 20) return '#10B981' // Cool - Green
  //     if (value < 25) return '#FDE047' // Mild - Yellow
  //     if (value < 30) return '#F59E0B' // Warm - Orange
  //     if (value < 35) return '#EF4444' // Hot - Red
  //     return '#DC2626' // Very hot - Dark red
  //   } else if (param === 'humidity') {
  //     // Humidity: Light to dark blue (0-100%)
  //     if (value < 20) return '#FEF3C7' // Very dry
  //     if (value < 40) return '#7DD3FC' // Dry
  //     if (value < 60) return '#3B82F6' // Moderate
  //     if (value < 80) return '#1E40AF' // Humid
  //     return '#1E3A8A' // Very humid
  //   } else if (param === 'wind_speed') {
  //     // Wind speed: Light to dark green (0-20 m/s)
  //     if (value < 2) return '#E0F2FE' // Calm
  //     if (value < 5) return '#86EFAC' // Light breeze
  //     if (value < 10) return '#22C55E' // Moderate
  //     if (value < 15) return '#15803D' // Strong
  //     return '#14532D' // Very strong
  //   } else if (param === 'clouds') {
  //     // Cloudiness: Light to dark gray (0-100%)
  //     if (value < 20) return '#F3F4F6' // Clear
  //     if (value < 40) return '#D1D5DB' // Partly cloudy
  //     if (value < 60) return '#9CA3AF' // Mostly cloudy
  //     if (value < 80) return '#6B7280' // Cloudy
  //     return '#374151' // Overcast
  //   }
  //   return '#666'
  // }

  // Get circle color and opacity based on parameter and average value
  // const getCircleStyle = () => {
  //   if (!averageValue) return { color: '#666', fillOpacity: 0.6 }
  //   const color = getGradientColor(averageValue, parameter)
  //   return { color, fillOpacity: 0.6 }
  // }

  // Get parameter label and unit
  const getParameterLabel = () => {
    switch (parameter) {
      case 'temp':
        return { label: 'Temperature', unit: '°C' }
      case 'humidity':
        return { label: 'Humidity', unit: '%' }
      case 'wind_speed':
        return { label: 'Wind Speed', unit: 'm/s' }
      case 'clouds':
        return { label: 'Cloudiness', unit: '%' }
      default:
        return { label: 'Value', unit: '' }
    }
  }

  // Helper function to calculate arrow end point based on wind direction
  const calculateArrowEnd = (centerLat: number, centerLon: number, direction: number, lengthKm: number) => {
    const R = 6371 // Earth's radius in km
    // Convert compass bearing (0° = North, clockwise) to mathematical bearing (0° = East, counterclockwise)
    const mathBearing = 90 - direction
    const bearing = (mathBearing * Math.PI) / 180
    const lat1 = (centerLat * Math.PI) / 180
    const lon1 = (centerLon * Math.PI) / 180

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(lengthKm / R) +
        Math.cos(lat1) * Math.sin(lengthKm / R) * Math.cos(bearing)
    )

    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(lengthKm / R) * Math.cos(lat1),
        Math.cos(lengthKm / R) - Math.sin(lat1) * Math.sin(lat2)
      )

    return {
      lat: (lat2 * 180) / Math.PI,
      lon: (lon2 * 180) / Math.PI,
    }
  }

  // Get wind arrow color based on speed
  const getWindColor = (speed: number) => {
    if (speed < 2) return '#E0F2FE' // Calm
    if (speed < 5) return '#86EFAC' // Light breeze
    if (speed < 10) return '#22C55E' // Moderate
    if (speed < 15) return '#15803D' // Strong
    return '#14532D' // Very strong
  }

  // Get temperature color based on value
  const getTemperatureColor = (temp: number) => {
    if (temp < -10) return '#0C4A6E' // Very cold - Dark blue
    if (temp < -5) return '#075985' // Freezing - Navy blue
    if (temp < 0) return '#0369A1' // Below freezing - Blue
    if (temp < 5) return '#0EA5E9' // Cold - Light blue
    if (temp < 10) return '#38BDF8' // Cool - Sky blue
    if (temp < 20) return '#10B981' // Mild - Green
    if (temp < 25) return '#FDE047' // Pleasant - Yellow
    if (temp < 30) return '#F59E0B' // Warm - Orange
    if (temp < 35) return '#EF4444' // Hot - Red
    return '#DC2626' // Very hot - Dark red
  }

  // Generate temperature thermometer icons
  const generateTemperatureIcons = () => {
    if (!averageValue || parameter !== 'temp') return []
    
    const icons = []
    const numIcons = 6 // 6 thermometers in a circle pattern
    const color = getTemperatureColor(averageValue)
    
    for (let i = 0; i < numIcons; i++) {
      const angle = (i * 360) / numIcons
      const distance = 0.3 // 300m from center
      
      const pos = calculateArrowEnd(lat, lon, angle, distance)
      
      icons.push({
        id: `temp-${i}`,
        position: [pos.lat, pos.lon] as [number, number],
        color: color,
      })
    }
    
    return icons
  }

  // Generate wind arrows based on wind speed and direction
  const generateWindArrows = () => {
    if (!windData || windData.speed < 0.5) return [] // Don't show arrows for very light wind
    
    const arrows = []
    const numArrows = Math.min(Math.ceil(windData.speed / 2), 8) // More arrows for stronger wind, max 8
    const arrowLength = 0.3 // 300m arrows
    const arrowColor = getWindColor(windData.speed)
    
    // Create arrows in a grid pattern within the circle
    for (let i = 0; i < numArrows; i++) {
      const angle = (i * 360) / numArrows
      const distance = 0.3 // 300m from center
      
      // Calculate position around the circle
      const centerPos = calculateArrowEnd(lat, lon, angle, distance)
      
      // Wind direction is where wind comes FROM (e.g., 168° = from SSE)
      // Arrow should point FROM that direction (168°) TO opposite direction (168° + 180°)
      
      // DEBUG: Log the directions
      if (i === 0) {
        const windToDirection = (windData.direction + 180) % 360
        console.log('Wind FROM:', windData.direction, '° | Wind TO:', windToDirection, '°')
      }
      
      // Start point: in the direction the wind is coming from
      const startPos = calculateArrowEnd(centerPos.lat, centerPos.lon, windData.direction, arrowLength / 2)
      
      // End point: in the opposite direction (where wind is blowing to)
      const windToDirection = (windData.direction + 180) % 360
      const endPos = calculateArrowEnd(centerPos.lat, centerPos.lon, windToDirection, arrowLength / 2)
      
      arrows.push({
        id: `arrow-${i}`,
        start: [startPos.lat, startPos.lon] as [number, number],
        end: [endPos.lat, endPos.lon] as [number, number],
        color: arrowColor,
      })
    }
    
    return arrows
  }

  // Generate calm wind indicators (small dots) for very light wind
  const generateCalmIndicators = () => {
    if (!windData || windData.speed >= 0.5) return []
    
    const indicators = []
    const numDots = 6 // 6 small dots in a circle pattern
    
    for (let i = 0; i < numDots; i++) {
      const angle = (i * 360) / numDots
      const distance = 0.3 // 300m from center
      
      const pos = calculateArrowEnd(lat, lon, angle, distance)
      
      indicators.push({
        id: `calm-${i}`,
        position: [pos.lat, pos.lon] as [number, number],
      })
    }
    
    return indicators
  }

  // Generate rainfall droplets based on actual precipitation data
  const generateRainfallDroplets = () => {
    if (parameter !== 'clouds') return [] // Only show when rainfall is selected
    if (precipitationData === 0) return [] // No droplets if no rain
    
    const droplets = []
    // More droplets for higher precipitation (1 droplet per 2mm of rain, max 8)
    const numDroplets = Math.min(Math.ceil(precipitationData / 2), 8)
    
    for (let i = 0; i < numDroplets; i++) {
      const angle = (i * 360) / numDroplets + 30 // Offset from wind arrows
      const distance = 0.25 // 250m from center
      
      const pos = calculateArrowEnd(lat, lon, angle, distance)
      
      droplets.push({
        id: `droplet-${i}`,
        position: [pos.lat, pos.lon] as [number, number],
      })
    }
    
    return droplets
  }

  // Get humidity color based on value
  const getHumidityColor = (humidity: number) => {
    if (humidity < 20) return '#FEF3C7' // Very dry - Light yellow
    if (humidity < 40) return '#7DD3FC' // Dry - Light blue
    if (humidity < 60) return '#3B82F6' // Moderate - Blue
    if (humidity < 80) return '#1E40AF' // Humid - Dark blue
    return '#1E3A8A' // Very humid - Navy
  }

  // Generate humidity wavy lines (pairs of parallel horizontal wavy lines)
  const generateHumidityWaves = () => {
    if (!averageValue || parameter !== 'humidity') return []
    
    const waves = []
    const numWaves = 4 // 4 wavy lines around the circle
    const color = getHumidityColor(averageValue)
    
    for (let i = 0; i < numWaves; i++) {
      const angle = (i * 360) / numWaves
      const distance = 0.3 // 300m from center
      
      const centerPos = calculateArrowEnd(lat, lon, angle, distance)
      
      // Create a small wavy line at this position
      const wavePoints: [number, number][] = []
      const numPoints = 15
      const waveLength = 0.08 // 80m wave length
      
      for (let j = 0; j < numPoints; j++) {
        const t = j / (numPoints - 1)
        const waveAngle = angle + 90 // Perpendicular to radius
        const offset = Math.sin(t * Math.PI * 3) * 0.02 // 20m amplitude
        const alongWave = (t - 0.5) * waveLength
        
        const pointAngle = waveAngle
        const pointDistance = alongWave
        
        const wavePoint = calculateArrowEnd(centerPos.lat, centerPos.lon, pointAngle, pointDistance + offset)
        wavePoints.push([wavePoint.lat, wavePoint.lon])
      }
      
      waves.push({
        id: `wave-${i}`,
        positions: wavePoints,
        color: color,
      })
    }
    
    return waves
  }

  if (!lat || !lon || !date) {
    return null
  }

  const { label, unit } = getParameterLabel()
  const windArrows = windData ? generateWindArrows() : []
  const calmIndicators = windData ? generateCalmIndicators() : []
  const rainfallDroplets = generateRainfallDroplets()
  const humidityWaves = generateHumidityWaves()
  const temperatureIcons = generateTemperatureIcons()

  return (
    <>
      {/* Show error message */}
      {error && (
        <Marker
          position={[lat, lon]}
          icon={L.divIcon({
            html: `<div style="background: #DC2626; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
            className: '',
            iconSize: [20, 20],
          })}
        >
          <Popup>
            <strong style={{ color: '#DC2626' }}>⚠️ Error Loading Weather Data</strong>
            <br />
            <small>{error}</small>
            <br />
            <br />
            <small style={{ color: '#666' }}>
              Using Open-Meteo API (free, no API key required)
            </small>
          </Popup>
        </Marker>
      )}

      {/* Show center point marker */}
      {!isLoading && !error && averageValue !== null && (
        <Marker
          position={[lat, lon]}
          icon={L.divIcon({
            html: `<div style="background: #007bff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
            className: '',
            iconSize: [16, 16],
          })}
        >
          <Popup>
            <strong>Historical Weather Data - 1km Radius</strong>
            <br />
            <small style={{ color: '#666' }}>Date: {date} (Open-Meteo API)</small>
            <br />
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
            <br />
            <br />
            <strong>
              {label}: {averageValue.toFixed(2)} {unit}
            </strong>
            <br />
            <small style={{ color: '#10B981' }}>✓ Free API - No key required</small>
          </Popup>
        </Marker>
      )}

      {/* Wind direction arrows - only show when wind parameter is selected */}
      {!isLoading && !error && parameter === 'wind_speed' && windArrows.map((arrow) => {
        // Calculate the center point and angle for the arrow
        const centerLat = (arrow.start[0] + arrow.end[0]) / 2
        const centerLon = (arrow.start[1] + arrow.end[1]) / 2
        
        // Calculate rotation angle from start to end
        const dy = arrow.end[0] - arrow.start[0]
        const dx = arrow.end[1] - arrow.start[1]
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI)
        
        return (
          <Marker
            key={arrow.id}
            position={[centerLat, centerLon]}
            icon={L.divIcon({
              html: `
                <svg width="30" height="30" viewBox="0 0 30 30" style="transform: rotate(${rotation}deg);">
                  <path d="M 5,15 L 25,15 L 20,10 M 25,15 L 20,20" 
                        fill="none" 
                        stroke="${arrow.color}" 
                        stroke-width="3" 
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
              `,
              className: '',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          />
        )
      })}

      {/* Calm wind indicators (small dots for wind < 0.5 m/s) - only show when wind parameter is selected */}
      {!isLoading && !error && parameter === 'wind_speed' && calmIndicators.map((indicator) => (
        <Circle
          key={indicator.id}
          center={indicator.position}
          radius={20} // 20m small dots
          pathOptions={{
            color: '#94A3B8',
            fillColor: '#94A3B8',
            fillOpacity: 0.6,
            weight: 1,
          }}
        />
      ))}

      {/* Rainfall droplets (for clouds/precipitation) - smaller */}
      {!isLoading && !error && rainfallDroplets.map((droplet) => (
        <Marker
          key={droplet.id}
          position={droplet.position}
          icon={L.divIcon({
            html: `
              <svg width="10" height="12" viewBox="0 0 10 12" style="filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));">
                <path d="M5 0 C5 0, 0 5, 0 7.5 C0 10, 2.2 12, 5 12 C7.8 12, 10 10, 10 7.5 C10 5, 5 0, 5 0 Z" 
                      fill="#3B82F6" 
                      stroke="#1E40AF" 
                      stroke-width="0.8"/>
              </svg>
            `,
            className: '',
            iconSize: [10, 12],
            iconAnchor: [5, 12],
          })}
        />
      ))}

      {/* Humidity wavy lines - using SVG icons instead of polylines */}
      {!isLoading && !error && humidityWaves.map((wave) => {
        // Use the center position of the wave
        const centerIndex = Math.floor(wave.positions.length / 2)
        const centerPos = wave.positions[centerIndex]
        
        return (
          <Marker
            key={wave.id}
            position={centerPos}
            icon={L.divIcon({
              html: `
                <svg width="40" height="12" viewBox="0 0 40 12" style="overflow: visible;">
                  <path d="M 2,6 Q 5,2 8,6 T 14,6 T 20,6 T 26,6 T 32,6 T 38,6" 
                        fill="none" 
                        stroke="${wave.color}" 
                        stroke-width="2.5" 
                        stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
              `,
              className: '',
              iconSize: [40, 12],
              iconAnchor: [20, 6],
            })}
          />
        )
      })}

      {/* Temperature thermometer icons */}
      {!isLoading && !error && temperatureIcons.map((icon) => (
        <Marker
          key={icon.id}
          position={icon.position}
          icon={L.divIcon({
            html: `
              <svg width="20" height="28" viewBox="0 0 20 28">
                <rect x="7" y="2" width="6" height="14" rx="3" fill="none" stroke="${icon.color}" stroke-width="2"/>
                <circle cx="10" cy="21" r="5" fill="${icon.color}" stroke="${icon.color}" stroke-width="2"/>
                <line x1="10" y1="16" x2="10" y2="21" stroke="${icon.color}" stroke-width="3"/>
              </svg>
            `,
            className: '',
            iconSize: [20, 28],
            iconAnchor: [10, 14],
          })}
        />
      ))}

      {/* Weather data popup marker at center */}
      {!isLoading && !error && averageValue !== null && areaDataPoints.length > 0 && (
        <Marker
          position={[lat, lon]}
          icon={L.divIcon({
            html: `<div style="background: #4A90E2; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            className: '',
            iconSize: [12, 12],
          })}
        >
          <Popup>
            <strong>Weather Data - 1km Radius</strong>
            <br />
            <small style={{ color: '#666' }}>Date: {date} (Open-Meteo API)</small>
            <br />
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
            <br />
            <br />
            <strong>
              {label}: {averageValue.toFixed(2)} {unit}
            </strong>
            <br />
            <br />
            {(() => {
              const hourly = areaDataPoints[0].weatherData.hourly
              const hourIndex = 12
              const temp = getHourlyValue(hourly.temperature_2m, hourIndex) || 0
              const humidity = getHourlyValue(hourly.relative_humidity_2m, hourIndex) || 0
              const windSpeed = getHourlyValue(hourly.wind_speed_10m, hourIndex) || 0
              const clouds = getHourlyValue(hourly.cloud_cover, hourIndex) || 0
              const pressure = getHourlyValue(hourly.pressure_msl, hourIndex)
              const weatherCode = getHourlyValue(hourly.weather_code, hourIndex)
              
              return (
                <>
                  <strong>Temperature:</strong> {temp.toFixed(1)}°C
                  <br />
                  <strong>Humidity:</strong> {humidity.toFixed(0)}%
                  <br />
                  <strong>Wind:</strong> {windSpeed.toFixed(1)} m/s
                  {windData && (
                    <> from {windData.direction.toFixed(0)}°</>
                  )}
                  <br />
                  <strong>Clouds:</strong> {clouds.toFixed(0)}%
                  <br />
                  {pressure && (
                    <>
                      <strong>Pressure:</strong> {pressure.toFixed(0)} hPa
                      <br />
                    </>
                  )}
                  {weatherCode !== null && (
                    <>
                      <strong>Condition:</strong> {getWeatherDescription(weatherCode)}
                      <br />
                    </>
                  )}
                  <br />
                  <small>Time: {hourly.time[hourIndex]}</small>
                  <br />
                  {windData && windData.speed >= 0.5 && (
                    <>
                      <small style={{ color: '#1E40AF' }}>→ Blue arrows show wind direction</small>
                      <br />
                    </>
                  )}
                  {windData && windData.speed < 0.5 && (
                    <>
                      <small style={{ color: '#94A3B8' }}>○ Gray dots indicate calm wind</small>
                      <br />
                    </>
                  )}
                  <small style={{ color: '#10B981' }}>✓ Free API - No key required</small>
                </>
              )
            })()}
          </Popup>
        </Marker>
      )}

      {/* Show loading state */}
      {isLoading && (
        <Marker
          position={[lat, lon]}
          icon={L.divIcon({
            html: `<div style="background:#666; width:20px; height:20px; border-radius:50%; border:3px solid white; animation: pulse 1s infinite;"></div>
                   <style>
                     @keyframes pulse {
                       0% { opacity: 1; transform: scale(1); }
                       50% { opacity: 0.5; transform: scale(1.2); }
                       100% { opacity: 1; transform: scale(1); }
                     }
                   </style>`,
            className: '',
            iconSize: [20, 20],
          })}
        >
          <Popup>
            <strong>Loading historical weather data...</strong>
            <br />
            Fetching data for {date}
            <br />
            <small style={{ color: '#10B981' }}>Using Open-Meteo API (free)</small>
          </Popup>
        </Marker>
      )}
    </>
  )
}
