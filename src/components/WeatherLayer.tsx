import React, { useState, useEffect } from 'react'
import { Circle, Marker, Popup, Polyline } from 'react-leaflet'
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

  // Add SVG arrowhead marker definition to the map and keep it updated
  useEffect(() => {
    const addArrowheadMarker = () => {
      const mapContainer = document.querySelector('.leaflet-container')
      if (mapContainer) {
        const svgs = mapContainer.querySelectorAll('svg.leaflet-zoom-animated')
        svgs.forEach(svg => {
          if (!svg.querySelector('#arrowhead')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
            marker.setAttribute('id', 'arrowhead')
            marker.setAttribute('markerWidth', '8')
            marker.setAttribute('markerHeight', '8')
            marker.setAttribute('refX', '6')
            marker.setAttribute('refY', '4')
            marker.setAttribute('orient', 'auto')
            marker.setAttribute('markerUnits', 'strokeWidth')
            
            // Create two lines forming a ">" shape
            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line1.setAttribute('x1', '0')
            line1.setAttribute('y1', '0')
            line1.setAttribute('x2', '6')
            line1.setAttribute('y2', '4')
            line1.setAttribute('stroke', '#1E40AF') // Change this color for arrowhead
            line1.setAttribute('stroke-width', '1')
            line1.setAttribute('stroke-linecap', 'round')
            
            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line2.setAttribute('x1', '0')
            line2.setAttribute('y1', '8')
            line2.setAttribute('x2', '6')
            line2.setAttribute('y2', '4')
            line2.setAttribute('stroke', '#1E40AF') // Change this color for arrowhead
            line2.setAttribute('stroke-width', '1')
            line2.setAttribute('stroke-linecap', 'round')
            
            marker.appendChild(line1)
            marker.appendChild(line2)
            defs.appendChild(marker)
            svg.insertBefore(defs, svg.firstChild)
          }
        })
      }
    }

    // Add marker initially
    addArrowheadMarker()

    // Re-add marker after short delays to catch any re-renders
    const timer1 = setTimeout(addArrowheadMarker, 100)
    const timer2 = setTimeout(() => {
      addArrowheadMarker()
      // Also reapply markers to all polylines
      const paths = document.querySelectorAll('.leaflet-interactive[stroke="#1E40AF"]')
      paths.forEach(path => {
        path.setAttribute('marker-end', 'url(#arrowhead)')
      })
    }, 200)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [windData, areaDataPoints])

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
  const getGradientColor = (value: number, param: string) => {
    if (param === 'temp') {
      // Temperature: Blue (cold) to Red (hot) (-10°C to 40°C)
      if (value < 0) return '#1E3A8A' // Very cold - Navy
      if (value < 10) return '#3B82F6' // Cold - Blue
      if (value < 20) return '#10B981' // Cool - Green
      if (value < 25) return '#FDE047' // Mild - Yellow
      if (value < 30) return '#F59E0B' // Warm - Orange
      if (value < 35) return '#EF4444' // Hot - Red
      return '#DC2626' // Very hot - Dark red
    } else if (param === 'humidity') {
      // Humidity: Light to dark blue (0-100%)
      if (value < 20) return '#FEF3C7' // Very dry
      if (value < 40) return '#7DD3FC' // Dry
      if (value < 60) return '#3B82F6' // Moderate
      if (value < 80) return '#1E40AF' // Humid
      return '#1E3A8A' // Very humid
    } else if (param === 'wind_speed') {
      // Wind speed: Light to dark green (0-20 m/s)
      if (value < 2) return '#E0F2FE' // Calm
      if (value < 5) return '#86EFAC' // Light breeze
      if (value < 10) return '#22C55E' // Moderate
      if (value < 15) return '#15803D' // Strong
      return '#14532D' // Very strong
    } else if (param === 'clouds') {
      // Cloudiness: Light to dark gray (0-100%)
      if (value < 20) return '#F3F4F6' // Clear
      if (value < 40) return '#D1D5DB' // Partly cloudy
      if (value < 60) return '#9CA3AF' // Mostly cloudy
      if (value < 80) return '#6B7280' // Cloudy
      return '#374151' // Overcast
    }
    return '#666'
  }

  // Get circle color and opacity based on parameter and average value
  const getCircleStyle = () => {
    if (!averageValue) return { color: '#666', fillOpacity: 0.6 }
    const color = getGradientColor(averageValue, parameter)
    return { color, fillOpacity: 0.6 }
  }

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
    const bearing = (direction * Math.PI) / 180
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

  // Generate wind arrows based on wind speed and direction
  const generateWindArrows = () => {
    if (!windData || windData.speed < 0.5) return [] // Don't show arrows for very light wind
    
    const arrows = []
    const numArrows = Math.min(Math.ceil(windData.speed / 2), 8) // More arrows for stronger wind, max 8
    const arrowLength = 0.3 // 300m arrows
    
    // Create arrows in a grid pattern within the circle
    for (let i = 0; i < numArrows; i++) {
      const angle = (i * 360) / numArrows
      const distance = 0.3 // 300m from center
      
      // Calculate arrow start position
      const startPos = calculateArrowEnd(lat, lon, angle, distance)
      
      // Calculate arrow end position (pointing in wind direction)
      const endPos = calculateArrowEnd(startPos.lat, startPos.lon, windData.direction, arrowLength)
      
      arrows.push({
        id: `arrow-${i}`,
        start: [startPos.lat, startPos.lon] as [number, number],
        end: [endPos.lat, endPos.lon] as [number, number],
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

  // Generate rainfall droplets based on precipitation/cloud cover
  const generateRainfallDroplets = () => {
    if (!averageValue || parameter !== 'clouds') return []
    
    const droplets = []
    // More droplets for higher cloud cover (proxy for rainfall)
    const numDroplets = Math.min(Math.ceil(averageValue / 15), 8) // Max 8 droplets
    
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

  // Generate humidity wavy lines (pairs of parallel horizontal wavy lines)
  const generateHumidityWaves = () => {
    if (!averageValue || parameter !== 'humidity') return []
    
    const waves = []
    // More wave pairs for higher humidity
    const numWavePairs = Math.min(Math.ceil(averageValue / 20), 6) // Max 6 wave pairs
    
    for (let i = 0; i < numWavePairs; i++) {
      const angle = (i * 360) / numWavePairs + 15 // Offset positioning for placement around circle
      const distance = 0.28 // 280m from center
      
      const centerPos = calculateArrowEnd(lat, lon, angle, distance)
      
      // Create two parallel HORIZONTAL wavy lines (always east-west)
      const waveLength = 0.1 // 100m wave length
      const separation = 0.015 // 15m between the two lines
      const waveAmplitude = 0.015 // 15m wave height for more pronounced curves
      const numWavePoints = 12 // More points for smoother curves
      const numWaveCycles = 2 // Number of complete wave cycles
      
      // Generate top wavy line
      const topWavePoints: [number, number][] = []
      const topCenter = calculateArrowEnd(centerPos.lat, centerPos.lon, 0, separation / 2)
      
      for (let j = 0; j < numWavePoints; j++) {
        const t = j / (numWavePoints - 1) // 0 to 1
        const xOffset = (t - 0.5) * waveLength // -waveLength/2 to +waveLength/2
        const yOffset = Math.sin(t * Math.PI * 2 * numWaveCycles) * waveAmplitude // Multiple wave cycles
        
        const pointX = calculateArrowEnd(topCenter.lat, topCenter.lon, 90, xOffset) // Horizontal offset
        const point = calculateArrowEnd(pointX.lat, pointX.lon, 0, yOffset) // Vertical offset for wave
        
        topWavePoints.push([point.lat, point.lon])
      }
      
      // Generate bottom wavy line
      const bottomWavePoints: [number, number][] = []
      const bottomCenter = calculateArrowEnd(centerPos.lat, centerPos.lon, 180, separation / 2)
      
      for (let j = 0; j < numWavePoints; j++) {
        const t = j / (numWavePoints - 1) // 0 to 1
        const xOffset = (t - 0.5) * waveLength
        const yOffset = Math.sin(t * Math.PI * 2 * numWaveCycles) * waveAmplitude
        
        const pointX = calculateArrowEnd(bottomCenter.lat, bottomCenter.lon, 90, xOffset)
        const point = calculateArrowEnd(pointX.lat, pointX.lon, 0, yOffset)
        
        bottomWavePoints.push([point.lat, point.lon])
      }
      
      waves.push({
        id: `wave-top-${i}`,
        positions: topWavePoints,
      })
      
      waves.push({
        id: `wave-bottom-${i}`,
        positions: bottomWavePoints,
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
      {!isLoading && !error && parameter === 'wind_speed' && windArrows.map((arrow) => (
        <React.Fragment key={arrow.id}>
          <Polyline
            positions={[arrow.start, arrow.end]}
            pathOptions={{
              color: '#1E40AF',
              weight: 3,
              opacity: 1.0, // Change this for transparency
            }}
            eventHandlers={{
              add: (e) => {
                const polyline = e.target
                // Add arrowhead using SVG marker
                polyline._path.setAttribute('marker-end', 'url(#arrowhead)')
              }
            }}
          />
        </React.Fragment>
      ))}

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
                        stroke="#1E40AF" 
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
