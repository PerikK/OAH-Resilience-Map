import { useEffect, useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'
import { useSelection } from '../context/SelectionContext'
import { fetchHistoricalWeather, type HistoricalWeatherResponse } from '../services/openMeteoService'
import { getSite } from '../data/researchSites'

export function WeatherDataTable() {
  const { city, site, startDate, selectedWeatherMetrics } = useSelection()
  const [weatherData, setWeatherData] = useState<HistoricalWeatherResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!city || !site || site === 'all' || selectedWeatherMetrics.length === 0) {
        setWeatherData(null)
        return
      }

      const siteData = getSite(city, site)
      if (!siteData || !startDate) return

      setLoading(true)
      try {
        const data = await fetchHistoricalWeather(siteData.Latitude, siteData.Longitude, startDate)
        setWeatherData(data)
      } catch (error) {
        console.error('Failed to fetch weather data:', error)
        setWeatherData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [city, site, startDate, selectedWeatherMetrics])

  // Don't show table if no site selected or no weather metrics selected
  if (!city || !site || site === 'all' || selectedWeatherMetrics.length === 0) {
    return null
  }

  const siteData = getSite(city, site)
  if (!siteData) return null

  if (loading) {
    return (
      <Box
        sx={{
          padding: 3,
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!weatherData) {
    return (
      <Box sx={{ padding: 3, backgroundColor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
          No weather data available for {site} on {startDate}
        </Typography>
      </Box>
    )
  }

  // Calculate daily averages from hourly data
  const calculateAverage = (data: number[] | undefined): number => {
    if (!data || data.length === 0) return 0
    const sum = data.reduce((acc, val) => acc + val, 0)
    return sum / data.length
  }

  const getMetricLabel = (metric: string): string => {
    switch (metric) {
      case 'wind':
        return 'Wind Speed & Direction'
      case 'rainfall':
        return 'Rainfall'
      case 'humidity':
        return 'Humidity'
      case 'temperature':
        return 'Temperature'
      default:
        return metric
    }
  }

  const getMetricValue = (metric: string): string => {
    const hourly = weatherData.hourly
    switch (metric) {
      case 'wind': {
        const avgSpeed = calculateAverage(hourly.wind_speed_10m)
        const avgDirection = calculateAverage(hourly.wind_direction_10m)
        return `${avgSpeed.toFixed(1)} m/s, ${avgDirection.toFixed(0)}°`
      }
      case 'rainfall': {
        const totalRain = hourly.precipitation?.reduce((acc, val) => acc + val, 0) || 0
        return `${totalRain.toFixed(1)} mm`
      }
      case 'humidity': {
        const avgHumidity = calculateAverage(hourly.relative_humidity_2m)
        return `${avgHumidity.toFixed(1)}%`
      }
      case 'temperature': {
        const avgTemp = calculateAverage(hourly.temperature_2m)
        return `${avgTemp.toFixed(1)}°C`
      }
      default:
        return 'N/A'
    }
  }

  const getMetricUnit = (metric: string): string => {
    switch (metric) {
      case 'wind':
        return 'm/s, degrees'
      case 'rainfall':
        return 'mm'
      case 'humidity':
        return '%'
      case 'temperature':
        return '°C'
      default:
        return ''
    }
  }

  return (
    <Box sx={{ backgroundColor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ padding: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Weather Data
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {siteData['Site Nr.']} - {siteData['Site Name']}, {city} | {startDate}
        </Typography>
      </Box>

      <TableContainer sx={{ backgroundColor: 'background.paper' }}>
        <Table sx={{ backgroundColor: 'background.paper' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderColor: 'divider' }}>Metric</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderColor: 'divider' }} align="right">
                Value
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderColor: 'divider' }} align="center">
                Unit
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: 'background.paper' }}>
            {selectedWeatherMetrics.map((metric) => (
              <TableRow key={metric} hover sx={{ backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell sx={{ borderColor: 'divider', color: 'text.primary' }}>{getMetricLabel(metric)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                  {getMetricValue(metric)}
                </TableCell>
                <TableCell align="center" sx={{ color: 'text.secondary', fontSize: '14px', borderColor: 'divider' }}>
                  {getMetricUnit(metric)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
