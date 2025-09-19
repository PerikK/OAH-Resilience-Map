import { Box, Typography, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useSelection } from '../context/SelectionContext'
import { getCityCoordinates, getSitesByCity, getSite, type ResearchSite } from '../data/researchSites'
import 'leaflet/dist/leaflet.css'

const StyledMapContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '95%',
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
  const { city, site } = useSelection()
  const [loading, setLoading] = useState(true)
  const [sitesToShow, setSitesToShow] = useState<ResearchSite[]>([])

  useEffect(() => {
    setLoading(true)
    
    if (city) {
      const citySites = getSitesByCity(city)
      
      if (site === 'all') {
        setSitesToShow(citySites)
      } else if (site) {
        const selectedSite = getSite(city, site)
        setSitesToShow(selectedSite ? [selectedSite] : citySites)
      } else {
        setSitesToShow(citySites)
      }
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

  return (
    <StyledMapContainer>
      <MapContainer
        center={[cityCoords.lat, cityCoords.lng]}
        zoom={13}
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
      </MapContainer>
    </StyledMapContainer>
  )
}
