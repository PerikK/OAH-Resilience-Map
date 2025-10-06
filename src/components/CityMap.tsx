import { Box, Typography, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useSelection, type PollutantParameter } from '../context/SelectionContext'
import { getCityCoordinates, getSitesByCity, getSite, type ResearchSite } from '../data/researchSites'
import { AirQualityLayer } from './AirQualityLayer'
import 'leaflet/dist/leaflet.css'

const StyledMapContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    borderRadius: '8px',
  },
})

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
})

// Fix Leaflet default markers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export function CityMap() {
  const { city, site, startDate, pollutant, setPollutant } = useSelection()
  const [loading, setLoading] = useState(true)
  const [sitesToShow, setSitesToShow] = useState<ResearchSite[]>([])
  const [selectedSiteCoords, setSelectedSiteCoords] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    setLoading(true)
    
    if (city) {
      const citySites = getSitesByCity(city)
      
      if (site === 'all') {
        setSitesToShow(citySites)
        // For 'all', use city center coordinates
        const cityCoords = getCityCoordinates(city)
        setSelectedSiteCoords({ lat: cityCoords.lat, lon: cityCoords.lng })
      } else if (site) {
        const selectedSite = getSite(city, site)
        setSitesToShow(selectedSite ? [selectedSite] : citySites)
        // Set coordinates for the selected site
        if (selectedSite) {
          setSelectedSiteCoords({ lat: selectedSite.Latitude, lon: selectedSite.Longitude })
        }
      } else {
        setSitesToShow(citySites)
        setSelectedSiteCoords(null)
      }
    } else {
      setSelectedSiteCoords(null)
    }
    
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [city, site])

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading {city} map...
        </Typography>
      </LoadingContainer>
    )
  }

  if (!city) {
    return (
      <LoadingContainer>
        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          Please select a city to view the map
        </Typography>
      </LoadingContainer>
    )
  }

  if (sitesToShow.length === 0) {
    return (
      <LoadingContainer>
        <Typography variant="body2" color="error">
          No sites found for {city}
        </Typography>
      </LoadingContainer>
    )
  }

  const cityCoords = getCityCoordinates(city)

  // Get legend colors based on selected pollutant
  const getLegendItems = () => {
    if (pollutant === 'pm2_5') {
      return [
        { color: '#FEF9C3', label: '0-12 μg/m³ (Good)' },
        { color: '#FDE047', label: '12-35 μg/m³ (Moderate)' },
        { color: '#EAB308', label: '35-55 μg/m³ (Unhealthy)' },
        { color: '#F59E0B', label: '55-75 μg/m³ (Very Unhealthy)' },
        { color: '#DC2626', label: '75+ μg/m³ (Hazardous)' },
      ]
    } else if (pollutant === 'pm10') {
      return [
        { color: '#FEF3C7', label: '0-20 μg/m³ (Good)' },
        { color: '#D97706', label: '20-50 μg/m³ (Moderate)' },
        { color: '#92400E', label: '50-100 μg/m³ (Unhealthy)' },
        { color: '#78350F', label: '100-150 μg/m³ (Very Unhealthy)' },
        { color: '#451A03', label: '150+ μg/m³ (Hazardous)' },
      ]
    } else if (pollutant === 'o3') {
      return [
        { color: '#E0F2FE', label: '0-50 μg/m³ (Good)' },
        { color: '#7DD3FC', label: '50-100 μg/m³ (Moderate)' },
        { color: '#3B82F6', label: '100-150 μg/m³ (Unhealthy)' },
        { color: '#1E40AF', label: '150-200 μg/m³ (Very Unhealthy)' },
        { color: '#1E3A8A', label: '200+ μg/m³ (Hazardous)' },
      ]
    } else {
      // AQI
      return [
        { color: '#00E400', label: '1 - Good' },
        { color: '#FFFF00', label: '2 - Fair' },
        { color: '#FF7E00', label: '3 - Moderate' },
        { color: '#FF0000', label: '4 - Poor' },
        { color: '#8F3F97', label: '5 - Very Poor' },
      ]
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Pollutant selector and legend */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'flex-start', flexShrink: 0 }}>
        <FormControl component="fieldset" size="small">
          <FormLabel component="legend" sx={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', mb: 1 }}>
            Air Pollutant
          </FormLabel>
          <RadioGroup
            row
            value={pollutant}
            onChange={(e) => setPollutant(e.target.value as PollutantParameter)}
            sx={{ gap: 2 }}
          >
            <FormControlLabel
              value="pm2_5"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#4f46e5' } }} />}
              label={<Typography sx={{ fontSize: '12px' }}>PM2.5</Typography>}
            />
            <FormControlLabel
              value="pm10"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#4f46e5' } }} />}
              label={<Typography sx={{ fontSize: '12px' }}>PM10</Typography>}
            />
            <FormControlLabel
              value="o3"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#4f46e5' } }} />}
              label={<Typography sx={{ fontSize: '12px' }}>Ozone (O₃)</Typography>}
            />
            <FormControlLabel
              value="aqi"
              control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#4f46e5' } }} />}
              label={<Typography sx={{ fontSize: '12px' }}>AQI</Typography>}
            />
          </RadioGroup>
        </FormControl>

        {/* Legend */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', mb: 1 }}>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {getLegendItems().map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: item.color,
                    borderRadius: '3px',
                    border: '1px solid #ddd',
                  }}
                />
                <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <StyledMapContainer sx={{ flex: 1, minHeight: 0 }}>
      <MapContainer
        center={[cityCoords.lat, cityCoords.lng]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        key={`${city}-${site}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {sitesToShow.map((siteData) => (
          <Marker 
            key={siteData['Site Nr.']} 
            position={[siteData.Latitude, siteData.Longitude]}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {siteData['Site Nr.']} - {siteData['Site Name']}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>City:</strong> {siteData.City}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Coordinates:</strong> {siteData.Latitude.toFixed(5)}, {siteData.Longitude.toFixed(5)}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
        
        {/* Air Quality Layer - shows current pollution data */}
        {selectedSiteCoords && startDate && (
          <AirQualityLayer
            lat={selectedSiteCoords.lat}
            lon={selectedSiteCoords.lon}
            date={startDate}
            parameter={pollutant}
          />
        )}
      </MapContainer>
    </StyledMapContainer>
    </Box>
  )
}
