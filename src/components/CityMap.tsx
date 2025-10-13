import { Box, Typography, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { useSelection } from '../context/SelectionContext'
import { getCityCoordinates, getSitesByCity, getSite, getUniqueCities, type ResearchSite } from '../data/researchSites'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { WeatherLayer } from './WeatherLayer'
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
  const { city, site, startDate, selectedWeatherMetrics, setCity, setSite } = useSelection()
  const [loading, setLoading] = useState(true)
  const [sitesToShow, setSitesToShow] = useState<ResearchSite[]>([])
  const [selectedSiteCoords, setSelectedSiteCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite')

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

  // Show Europe-centered map when no city is selected
  if (!city) {
    const cities = getUniqueCities()
    
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Map Type Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 1 }}>
          <Box
            onClick={() => setMapType('satellite')}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: mapType === 'satellite' ? '#4A90E2' : 'white',
              color: mapType === 'satellite' ? 'white' : '#6B7280',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: mapType === 'satellite' ? '#3A7BC8' : '#F3F4F6',
              },
            }}
          >
            Satellite
          </Box>
          <Box
            onClick={() => setMapType('street')}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: mapType === 'street' ? '#4A90E2' : 'white',
              color: mapType === 'street' ? 'white' : '#6B7280',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: mapType === 'street' ? '#3A7BC8' : '#F3F4F6',
              },
            }}
          >
            Street
          </Box>
        </Box>
        <StyledMapContainer sx={{ flex: 1, minHeight: 0 }}>
          <MapContainer
            center={[47.0, 2.0]} // Center of Europe (France)
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            {mapType === 'satellite' ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            )}
            
            {/* City circles - clickable to select city */}
            {cities.map((cityName) => {
              const cityCoords = getCityCoordinates(cityName)
              const citySites = getSitesByCity(cityName)
              
              return (
                <Circle
                  key={cityName}
                  center={[cityCoords.lat, cityCoords.lng]}
                  radius={35000} // 15km radius
                  pathOptions={{
                    color: '#000',
                    fillColor: '#10B981',
                    fillOpacity: 0.7,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setCity(cityName as any)
                      setSite(null)
                    },
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 150 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '14px' }}>
                        {cityName}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '12px', mb: 1 }}>
                        {citySites.length} research site{citySites.length !== 1 ? 's' : ''}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '11px', 
                          color: '#4A90E2', 
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => {
                          setCity(cityName as any)
                          setSite(null)
                        }}
                      >
                        Click to select →
                      </Typography>
                    </Box>
                  </Popup>
                </Circle>
              )
            })}
          </MapContainer>
        </StyledMapContainer>
      </Box>
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
  
  // Get map center - use selected site if available, otherwise city center
  const getMapCenter = (): [number, number] => {
    if (site && site !== 'all') {
      const selectedSite = getSite(city, site)
      if (selectedSite) {
        return [selectedSite.Latitude, selectedSite.Longitude]
      }
    }
    return [cityCoords.lat, cityCoords.lng]
  }

  // Create custom icon with health risk symbol
  const createHealthRiskIcon = (siteNr: string) => {
    const healthData = getHealthRiskForSite(siteNr)
    if (!healthData) {
      // Return default Leaflet icon instead of undefined
      return new L.Icon.Default()
    }

    const value = healthData.health_risk_score
    let color = '#10B981' // Green - Low risk
    let symbol = '▼' // Down triangle
    
    if (value >= 0.75) {
      color = '#DC2626' // Dark red - Very high risk
      symbol = '▲' // Up triangle
    } else if (value >= 0.5) {
      color = '#EF4444' // Red - High risk
      symbol = '▲' // Up triangle
    } else if (value >= 0.25) {
      color = '#F59E0B' // Orange - Moderate risk
      symbol = '▬' // Dash
    }

    const svgIcon = `
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
        <text x="16" y="20" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${symbol}</text>
      </svg>
    `

    return new L.DivIcon({
      html: svgIcon,
      className: 'health-risk-marker',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    })
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Map Type Toggle and Health Risk Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, gap: 2 }}>
        {/* Health Risk Legend */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
            Health Risk:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#10B981"/>
              <text x="16" y="20" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">▼</text>
            </svg>
            <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>Low</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#F59E0B"/>
              <text x="16" y="20" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">▬</text>
            </svg>
            <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>Moderate</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#EF4444"/>
              <text x="16" y="20" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">▲</text>
            </svg>
            <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>High</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="#DC2626"/>
              <text x="16" y="20" fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">▲</text>
            </svg>
            <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>Very High</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 25 41">
              <path fill="#2A81CB" stroke="#000" strokeWidth="2" d="M12.5,0.5C6.2,0.5,1,5.7,1,12c0,6.3,11.5,28,11.5,28S24,18.3,24,12C24,5.7,18.8,0.5,12.5,0.5z"/>
              <circle fill="#FFF" cx="12.5" cy="12" r="5"/>
            </svg>
            <Typography sx={{ fontSize: '11px', color: '#6b7280' }}>No Data</Typography>
          </Box>
        </Box>

        {/* Map Type Toggle */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            onClick={() => setMapType('satellite')}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: mapType === 'satellite' ? '#4A90E2' : 'white',
              color: mapType === 'satellite' ? 'white' : '#6B7280',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: mapType === 'satellite' ? '#3A7BC8' : '#F3F4F6',
              },
            }}
          >
            Satellite
          </Box>
          <Box
            onClick={() => setMapType('street')}
            sx={{
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: mapType === 'street' ? '#4A90E2' : 'white',
              color: mapType === 'street' ? 'white' : '#6B7280',
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: mapType === 'street' ? '#3A7BC8' : '#F3F4F6',
              },
            }}
          >
            Street
          </Box>
        </Box>
      </Box>
      <StyledMapContainer sx={{ flex: 1, minHeight: 0 }}>
      <MapContainer
        center={getMapCenter()}
        zoom={site && site !== 'all' ? 14 : 9}
        style={{ height: '100%', width: '100%' }}
        key={`${city}-${site}`}
      >
        {mapType === 'satellite' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}
        
        {sitesToShow.map((siteData) => {
          const healthData = getHealthRiskForSite(siteData['Site Nr.'])
          const customIcon = createHealthRiskIcon(siteData['Site Nr.'])
          
          return (
            <Marker 
              key={siteData['Site Nr.']} 
              position={[siteData.Latitude, siteData.Longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setSite(siteData['Site Nr.'] as any)
                },
              }}
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
                  {healthData && (
                    <Typography variant="body2" sx={{ mt: 1, pt: 1, borderTop: '1px solid #E5E7EB' }}>
                      <strong>Health Risk Score:</strong> {healthData.health_risk_score.toFixed(3)}
                    </Typography>
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 2,
                      fontSize: '11px', 
                      color: '#4A90E2', 
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => {
                      setSite(siteData['Site Nr.'] as any)
                    }}
                  >
                    Click to select this site →
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          )
        })}
        
        {/* Weather Layers - show selected weather data */}
        {selectedSiteCoords && startDate && selectedWeatherMetrics.map((metric) => {
          // Map metric to WeatherLayer parameter
          let parameter: 'temp' | 'humidity' | 'wind_speed' | 'clouds' = 'temp'
          if (metric === 'wind') parameter = 'wind_speed'
          else if (metric === 'humidity') parameter = 'humidity'
          else if (metric === 'rainfall') parameter = 'clouds' // Use clouds as proxy for rainfall
          
          return (
            <WeatherLayer
              key={metric}
              lat={selectedSiteCoords.lat}
              lon={selectedSiteCoords.lon}
              date={startDate}
              parameter={parameter}
            />
          )
        })}
      </MapContainer>
    </StyledMapContainer>
    </Box>
  )
}
