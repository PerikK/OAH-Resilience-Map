import { useEffect, useState } from 'react'
import { Box, TextField, MenuItem, Typography, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { useSelection } from '../context/SelectionContext'
import { getUniqueCities, getSitesByCity, type ResearchSite } from '../data/researchSites'
import type { City, Site } from '../mock_data/types'

export function CollapsibleSidebar() {
  const [cities, setCities] = useState<string[]>([])
  const [availableSites, setAvailableSites] = useState<ResearchSite[]>([])
  const {
    city,
    site,
    startDate,
    endDate,
    selectedHealthRisks,
    selectedWeatherMetrics,
    setCity,
    setSite,
    setStartDate,
    setEndDate,
    toggleHealthRisk,
    toggleWeatherMetric,
  } = useSelection()

  useEffect(() => {
    const uniqueCities = getUniqueCities()
    setCities(uniqueCities)
  }, [])

  useEffect(() => {
    if (city) {
      const sites = getSitesByCity(city)
      setAvailableSites(sites)
    }
  }, [city])

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: '60px',
        bottom: 0,
        width: '400px',
        backgroundColor: 'white',
        borderLeft: '1px solid #E5E7EB',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
        zIndex: 998,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Section 1: Dropdowns (1/4 of height) */}
      <Box sx={{ flex: '0 0 22%', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1F2937', fontWeight: 600, fontSize: '16px' }}>
          Select Parameters
        </Typography>

        {/* City Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Select an area
          </Typography>
          <TextField
            select
            size="small"
            value={city || ''}
            onChange={(e) => {
              setCity(e.target.value as City)
              setSite(null)
            }}
            placeholder="Select area"
            sx={{
              width: '280px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&:hover fieldset': {
                  borderColor: '#4A90E2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A90E2',
                },
              },
            }}
          >
            <MenuItem value="">Select area</MenuItem>
            {cities.map((cityName) => (
              <MenuItem key={cityName} value={cityName}>
                {cityName}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Site Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Select Sites
          </Typography>
          <TextField
            select
            size="small"
            value={site || ''}
            onChange={(e) => setSite(e.target.value as Site)}
            disabled={!city}
            placeholder="Select sites"
            sx={{
              width: '280px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&:hover fieldset': {
                  borderColor: '#4A90E2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4A90E2',
                },
              },
            }}
          >
            <MenuItem value="">Select sites</MenuItem>
            <MenuItem value="all">All Sites</MenuItem>
            {availableSites.map((siteData) => (
              <MenuItem key={siteData['Site Nr.']} value={siteData['Site Nr.']}>
                {siteData['Site Nr.']} - {siteData['Site Name']}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Date Range */}
        <Box>
          <Typography sx={{ mb: 1, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Select date range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
            />
            <Typography sx={{ color: '#6B7280' }}>-</Typography>
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4A90E2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4A90E2',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Section 2: Health Risk Selectors (reduced height) */}
      <Box sx={{ flex: '0 0 26%', padding: '24px', borderBottom: '1px solid #E5E7EB', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1F2937', fontWeight: 600, fontSize: '16px' }}>
          Health Risk Data
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedHealthRisks.includes('pathogen')}
                onChange={() => toggleHealthRisk('pathogen')}
                sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
              />
            }
            label={<Typography sx={{ fontSize: '14px' }}>Pathogen Risk</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedHealthRisks.includes('fecal')}
                onChange={() => toggleHealthRisk('fecal')}
                sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
              />
            }
            label={<Typography sx={{ fontSize: '14px' }}>Fecal Contamination Risk</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedHealthRisks.includes('arg')}
                onChange={() => toggleHealthRisk('arg')}
                sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
              />
            }
            label={<Typography sx={{ fontSize: '14px' }}>ARG Risk</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedHealthRisks.includes('overall')}
                onChange={() => toggleHealthRisk('overall')}
                sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
              />
            }
            label={<Typography sx={{ fontSize: '14px' }}>Overall Health Risk Score</Typography>}
          />
        </FormGroup>
      </Box>

      {/* Section 3: Weather Selectors (expanded height) */}
      <Box sx={{ flex: '0 0 52%', padding: '24px', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1F2937', fontWeight: 600, fontSize: '16px' }}>
          Weather Data
        </Typography>
        <FormGroup>
          {/* Wind Speed & Direction */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedWeatherMetrics.includes('wind')}
                  onChange={() => toggleWeatherMetric('wind')}
                  sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px' }}>Wind Speed & Direction</Typography>}
            />
            {selectedWeatherMetrics.includes('wind') && (
              <Box sx={{ ml: 4, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { color: '#E0F2FE', label: '0-2 m/s' },
                  { color: '#86EFAC', label: '2-5 m/s' },
                  { color: '#22C55E', label: '5-10 m/s' },
                  { color: '#15803D', label: '10-15 m/s' },
                  { color: '#14532D', label: '15+ m/s' },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: '2px',
                        border: '1px solid #ddd',
                      }}
                    />
                    <Typography sx={{ fontSize: '10px', color: '#6b7280' }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Rainfall */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedWeatherMetrics.includes('rainfall')}
                  onChange={() => toggleWeatherMetric('rainfall')}
                  sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px' }}>Rainfall</Typography>}
            />
            {selectedWeatherMetrics.includes('rainfall') && (
              <Box sx={{ ml: 4, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { color: '#F3F4F6', label: '0 mm' },
                  { color: '#BAE6FD', label: '0-2 mm' },
                  { color: '#7DD3FC', label: '2-5 mm' },
                  { color: '#0EA5E9', label: '5-10 mm' },
                  { color: '#0369A1', label: '10+ mm' },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: '2px',
                        border: '1px solid #ddd',
                      }}
                    />
                    <Typography sx={{ fontSize: '10px', color: '#6b7280' }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Humidity */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedWeatherMetrics.includes('humidity')}
                  onChange={() => toggleWeatherMetric('humidity')}
                  sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                />
              }
              label={<Typography sx={{ fontSize: '14px' }}>Humidity</Typography>}
            />
            {selectedWeatherMetrics.includes('humidity') && (
              <Box sx={{ ml: 4, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { color: '#FEF3C7', label: '0-20%' },
                  { color: '#7DD3FC', label: '20-40%' },
                  { color: '#3B82F6', label: '40-60%' },
                  { color: '#1E40AF', label: '60-80%' },
                  { color: '#1E3A8A', label: '80-100%' },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: '2px',
                        border: '1px solid #ddd',
                      }}
                    />
                    <Typography sx={{ fontSize: '10px', color: '#6b7280' }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </FormGroup>
      </Box>
    </Box>
  )
}
