import { Circle, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useState, useEffect } from 'react'
import { fetchAreaHistoricalAirPollution, type AreaAirPollutionPoint } from '../services/openWeatherService'

interface AirQualityLayerProps {
  lat: number
  lon: number
  date: string
  parameter?: 'aqi' | 'pm2_5' | 'pm10' | 'o3'
}

export function AirQualityLayer({ lat, lon, date, parameter = 'aqi' }: AirQualityLayerProps) {
  const [areaDataPoints, setAreaDataPoints] = useState<AreaAirPollutionPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [averageValue, setAverageValue] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!lat || !lon || !date) return

      setIsLoading(true)

      try {
        // Fetch air quality data for the area (20km radius)
        const areaData = await fetchAreaHistoricalAirPollution(lat, lon, date, 1)
        setAreaDataPoints(areaData)

        // Calculate average value for the parameter
        if (areaData.length > 0) {
          const values = areaData.map((point) => {
            if (parameter === 'aqi') {
              return point.airData.list[0].main.aqi
            }
            return point.airData.list[0].components[parameter] || 0
          })
          const avg = values.reduce((a, b) => a + b, 0) / values.length
          setAverageValue(avg)
        }
      } catch (error) {
        console.error('Failed to fetch area air quality data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [lat, lon, date, parameter])

  // Get gradient color based on pollution level
  const getGradientColor = (value: number, param: string) => {
    if (param === 'o3') {
      // Ozone: Light blue to dark blue (0-200 μg/m³)
      if (value < 50) return '#E0F2FE'
      if (value < 100) return '#7DD3FC'
      if (value < 150) return '#3B82F6'
      if (value < 200) return '#1E40AF'
      return '#1E3A8A'
    } else if (param === 'pm10') {
      // PM10: Light brown to dark brown (0-150 μg/m³)
      if (value < 20) return '#FEF3C7'
      if (value < 50) return '#D97706'
      if (value < 100) return '#92400E'
      if (value < 150) return '#78350F'
      return '#451A03'
    } else if (param === 'pm2_5') {
      // PM2.5: Light yellow to dark orange (0-100 μg/m³)
      if (value < 12) return '#FEF9C3'
      if (value < 35) return '#FDE047'
      if (value < 55) return '#EAB308'
      if (value < 75) return '#F59E0B'
      return '#DC2626'
    }
    return '#666'
  }

  // Get circle color and opacity based on parameter and average value
  const getCircleStyle = () => {
    if (!averageValue) return { color: '#666', fillOpacity: 0.5 }

    // For AQI, use traditional colors
    if (parameter === 'aqi') {
      const aqiColors: Record<number, string> = {
        1: '#00E400', // Good - Green
        2: '#FFFF00', // Fair - Yellow
        3: '#FF7E00', // Moderate - Orange
        4: '#FF0000', // Poor - Red
        5: '#8F3F97', // Very Poor - Purple
      }
      const avgAqi = Math.round(averageValue)
      return { color: aqiColors[avgAqi] || '#666', fillOpacity: 0.5 }
    }

    // For specific parameters, use gradient colors
    const color = getGradientColor(averageValue, parameter)

    return { color, fillOpacity: 0.6 }
  }

  // Get direction label
  const getDirectionLabel = (angle: number | null) => {
    if (angle === null) return 'Center'
    const directions = [
      'North',
      'NNE',
      'NE',
      'ENE',
      'East',
      'ESE',
      'SE',
      'SSE',
      'South',
      'SSW',
      'SW',
      'WSW',
      'West',
      'WNW',
      'NW',
      'NNW',
    ]
    const index = Math.round(angle / 22.5) % 16
    return directions[index]
  }

  if (!lat || !lon || !date) {
    return null
  }

  return (
    <>
      {/* Show center point marker */}
      {!isLoading && averageValue !== null && (
        <Marker
          position={[lat, lon]}
          icon={L.divIcon({
            html: `<div style="background: #007bff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
            className: '',
            iconSize: [16, 16],
          })}
        >
          <Popup>
            <strong>Current Air Quality - 20km Radius</strong>
            <br />
            <small style={{ color: '#666' }}>Note: Showing current data (historical data requires paid API)</small>
            <br />
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
            <br />
            <br />
            {parameter === 'aqi' ? (
              <>
                <strong>Average AQI: {averageValue.toFixed(1)}</strong>
                <br />
                <small>
                  {Math.round(averageValue) === 1 && 'Good'}
                  {Math.round(averageValue) === 2 && 'Fair'}
                  {Math.round(averageValue) === 3 && 'Moderate'}
                  {Math.round(averageValue) === 4 && 'Poor'}
                  {Math.round(averageValue) === 5 && 'Very Poor'}
                </small>
              </>
            ) : (
              <>
                <strong>
                  Average {parameter.toUpperCase()}: {averageValue.toFixed(2)} μg/m³
                </strong>
              </>
            )}
            <br />
            <small>Based on {areaDataPoints.length} sample points</small>
          </Popup>
        </Marker>
      )}

      {/* Show circular area overlay - main boundary circle */}
      {!isLoading && averageValue !== null && (
        <Circle
          center={[lat, lon]}
          radius={1000} // 1km in meters
          pathOptions={{
            color: getCircleStyle().color,
            fillColor: 'transparent',
            fillOpacity: 0,
            weight: 2,
          }}
        />
      )}

      {/* Show individual data point circles with color variations in polar pattern */}
      {!isLoading &&
        areaDataPoints.map((dataPoint) => {
          const aqi = dataPoint.airData?.list[0]?.main?.aqi
          const value =
            parameter === 'aqi' ? aqi : dataPoint.airData?.list[0]?.components[parameter]

          // Get color for this specific data point
          const pointColor =
            parameter === 'aqi'
              ? (() => {
                  const aqiColors: Record<number, string> = {
                    1: '#00E400',
                    2: '#FFFF00',
                    3: '#FF7E00',
                    4: '#FF0000',
                    5: '#8F3F97',
                  }
                  return aqiColors[aqi] || '#666'
                })()
              : getGradientColor(value || 0, parameter)

          // Adjust circle size based on distance from center (smaller for inner rings)
          const circleRadius = 300 // 300m in meters

          return (
            <Circle
              key={dataPoint.id}
              center={[dataPoint.lat, dataPoint.lon]}
              radius={circleRadius}
              pathOptions={{
                color: pointColor,
                fillColor: pointColor,
                fillOpacity: 0.5,
                weight: 1,
                opacity: 0.7,
              }}
            >
              <Popup>
                <strong>Air Quality Data Point</strong>
                <br />
                <strong>Direction:</strong> {getDirectionLabel(dataPoint.angle)}
                <br />
                <strong>Distance:</strong> {dataPoint.distance.toFixed(1)} km from center
                <br />
                <br />
                {parameter === 'aqi' ? (
                  <>
                    <strong>AQI: {aqi}</strong>
                    <br />
                    <small>
                      {aqi === 1 && 'Good'}
                      {aqi === 2 && 'Fair'}
                      {aqi === 3 && 'Moderate'}
                      {aqi === 4 && 'Poor'}
                      {aqi === 5 && 'Very Poor'}
                    </small>
                  </>
                ) : (
                  <>
                    <strong>
                      {parameter.toUpperCase()}: {value?.toFixed(2)} μg/m³
                    </strong>
                  </>
                )}
                <br />
                <small>
                  Lat: {dataPoint.lat.toFixed(4)}, Lon: {dataPoint.lon.toFixed(4)}
                </small>
                <br />
                <small>
                  Last update:{' '}
                  {new Date(dataPoint.airData.list[0].dt * 1000).toLocaleString()}
                </small>
              </Popup>
            </Circle>
          )
        })}

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
            <strong>Loading air quality data...</strong>
            <br />
            Fetching current pollution data
            <br />
            Please wait...
          </Popup>
        </Marker>
      )}
    </>
  )
}
