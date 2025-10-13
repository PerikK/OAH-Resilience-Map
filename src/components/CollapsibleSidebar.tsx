import { useEffect, useState } from 'react'
import { Box, TextField, MenuItem, Typography, Checkbox, FormControlLabel, FormGroup, Tooltip, Button } from '@mui/material'
import { useSelection, type City, type Site } from '../context/SelectionContext'
import { getUniqueCities, getSitesByCity, type ResearchSite } from '../data/researchSites'

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
    setSelectedHealthRisks,
    setSelectedWeatherMetrics,
    toggleHealthRisk,
    toggleWeatherMetric,
  } = useSelection()

  const allHealthRisks: ('pathogen' | 'fecal' | 'arg' | 'overall')[] = ['pathogen', 'fecal', 'arg', 'overall']
  const allWeatherMetrics: ('wind' | 'rainfall' | 'humidity' | 'temperature')[] = ['wind', 'rainfall', 'humidity', 'temperature']

  const handleSelectAllHealthRisks = () => {
    setSelectedHealthRisks(allHealthRisks)
  }

  const handleClearAllHealthRisks = () => {
    setSelectedHealthRisks([])
  }

  const handleSelectAllWeather = () => {
    setSelectedWeatherMetrics(allWeatherMetrics)
  }

  const handleClearAllWeather = () => {
    setSelectedWeatherMetrics([])
  }

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
        backgroundColor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
        zIndex: 998,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Section 1: Dropdowns (1/4 of height) */}
      <Box sx={{ flex: '0 0 auto', padding: '16px 20px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 600, fontSize: '15px' }}>
          Select Parameters
        </Typography>

        {/* City Selection */}
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ mb: 0.5, fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
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
                backgroundColor: 'background.default',
                color: 'text.primary',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiSelect-icon': {
                color: 'text.primary',
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
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ mb: 0.5, fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
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
                backgroundColor: 'background.default',
                color: 'text.primary',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiSelect-icon': {
                color: 'text.primary',
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
          <Typography sx={{ mb: 0.5, fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
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
                  backgroundColor: 'background.default',
                  color: 'text.primary',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& input': {
                  color: 'text.primary',
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: 'invert(0.5)',
                  cursor: 'pointer',
                },
              }}
            />
            <Typography sx={{ color: 'text.secondary' }}>-</Typography>
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.default',
                  color: 'text.primary',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& input': {
                  color: 'text.primary',
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: 'invert(0.5)',
                  cursor: 'pointer',
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Section 2: Health Risk Selectors (reduced height) */}
      <Box sx={{ flex: '0 0 26%', padding: '24px', borderBottom: '1px solid', borderColor: 'divider', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '16px' }}>
            Health Risk Data
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="text"
              onClick={handleSelectAllHealthRisks}
              disabled={!city || !site || site === 'all'}
              sx={{ 
                fontSize: '11px', 
                textTransform: 'none',
                minWidth: 'auto',
                padding: '2px 8px',
                color: '#4A90E2',
                '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.08)' }
              }}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={handleClearAllHealthRisks}
              disabled={!city || !site || site === 'all'}
              sx={{ 
                fontSize: '11px', 
                textTransform: 'none',
                minWidth: 'auto',
                padding: '2px 8px',
                color: '#6B7280',
                '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.08)' }
              }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
        <FormGroup>
          <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
            <span>
              <FormControlLabel
                disabled={!city || !site || site === 'all'}
                control={
                  <Checkbox
                    checked={selectedHealthRisks.includes('pathogen')}
                    onChange={() => toggleHealthRisk('pathogen')}
                    sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px' }}>Pathogen Risk</Typography>}
              />
            </span>
          </Tooltip>
          <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
            <span>
              <FormControlLabel
                disabled={!city || !site || site === 'all'}
                control={
                  <Checkbox
                    checked={selectedHealthRisks.includes('fecal')}
                    onChange={() => toggleHealthRisk('fecal')}
                    sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px' }}>Fecal Contamination Risk</Typography>}
              />
            </span>
          </Tooltip>
          <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
            <span>
              <FormControlLabel
                disabled={!city || !site || site === 'all'}
                control={
                  <Checkbox
                    checked={selectedHealthRisks.includes('arg')}
                    onChange={() => toggleHealthRisk('arg')}
                    sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px' }}>ARG Risk</Typography>}
              />
            </span>
          </Tooltip>
          <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
            <span>
              <FormControlLabel
                disabled={!city || !site || site === 'all'}
                control={
                  <Checkbox
                    checked={selectedHealthRisks.includes('overall')}
                    onChange={() => toggleHealthRisk('overall')}
                    sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '14px' }}>Overall Health Risk Score</Typography>}
              />
            </span>
          </Tooltip>
        </FormGroup>
      </Box>

      {/* Section 3: Weather Selectors (expanded height) */}
      <Box sx={{ flex: '0 0 52%', padding: '24px', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '16px' }}>
            Weather Data
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="text"
              onClick={handleSelectAllWeather}
              disabled={!city || !site || site === 'all'}
              sx={{ 
                fontSize: '11px', 
                textTransform: 'none',
                minWidth: 'auto',
                padding: '2px 8px',
                color: '#4A90E2',
                '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.08)' }
              }}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={handleClearAllWeather}
              disabled={!city || !site || site === 'all'}
              sx={{ 
                fontSize: '11px', 
                textTransform: 'none',
                minWidth: 'auto',
                padding: '2px 8px',
                color: '#6B7280',
                '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.08)' }
              }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
        <FormGroup>
          {/* Wind Speed & Direction */}
          <Box sx={{ mb: 2 }}>
            <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
              <span>
                <FormControlLabel
                  disabled={!city || !site || site === 'all'}
                  control={
                    <Checkbox
                      checked={selectedWeatherMetrics.includes('wind')}
                      onChange={() => toggleWeatherMetric('wind')}
                      sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <defs>
                          <marker id="legend-arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                            <line x1="0" y1="0" x2="3" y2="2" stroke="#1E40AF" strokeWidth="0.8" strokeLinecap="round"/>
                            <line x1="0" y1="4" x2="3" y2="2" stroke="#1E40AF" strokeWidth="0.8" strokeLinecap="round"/>
                          </marker>
                        </defs>
                        <line x1="2" y1="8" x2="14" y2="8" stroke="#1E40AF" strokeWidth="2" markerEnd="url(#legend-arrow)"/>
                      </svg>
                      <Typography sx={{ fontSize: '14px' }}>Wind Speed & Direction</Typography>
                    </Box>
                  }
                />
              </span>
            </Tooltip>
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
            <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
              <span>
                <FormControlLabel
                  disabled={!city || !site || site === 'all'}
                  control={
                    <Checkbox
                      checked={selectedWeatherMetrics.includes('rainfall')}
                      onChange={() => toggleWeatherMetric('rainfall')}
                      sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg width="10" height="12" viewBox="0 0 10 12">
                        <path d="M5 0 C5 0, 0 5, 0 7.5 C0 10, 2.2 12, 5 12 C7.8 12, 10 10, 10 7.5 C10 5, 5 0, 5 0 Z" 
                              fill="#3B82F6" 
                              stroke="#1E40AF" 
                              strokeWidth="0.8"/>
                      </svg>
                      <Typography sx={{ fontSize: '14px' }}>Rainfall</Typography>
                    </Box>
                  }
                />
              </span>
            </Tooltip>
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
            <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
              <span>
                <FormControlLabel
                  disabled={!city || !site || site === 'all'}
                  control={
                    <Checkbox
                      checked={selectedWeatherMetrics.includes('humidity')}
                      onChange={() => toggleWeatherMetric('humidity')}
                      sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg width="24" height="10" viewBox="0 0 24 10">
                        <path d="M 1,5 Q 2.5,2 4,5 T 7,5 T 10,5 T 13,5 T 16,5 T 19,5 T 22,5" 
                              fill="none" 
                              stroke="#1E40AF" 
                              strokeWidth="2" 
                              strokeLinecap="round"
                              strokeLinejoin="round"/>
                      </svg>
                      <Typography sx={{ fontSize: '14px' }}>Humidity</Typography>
                    </Box>
                  }
                />
              </span>
            </Tooltip>
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

          {/* Temperature */}
          <Box sx={{ mb: 2 }}>
            <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : ''} arrow>
              <span>
                <FormControlLabel
                  disabled={!city || !site || site === 'all'}
                  control={
                    <Checkbox
                      checked={selectedWeatherMetrics.includes('temperature')}
                      onChange={() => toggleWeatherMetric('temperature')}
                      sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <svg width="12" height="16" viewBox="0 0 12 16">
                        <rect x="4" y="1" width="4" height="8" fill="none" stroke="#DC2626" strokeWidth="1"/>
                        <circle cx="6" cy="12" r="3" fill="#DC2626" stroke="#DC2626" strokeWidth="1"/>
                        <line x1="6" y1="9" x2="6" y2="12" stroke="#DC2626" strokeWidth="2"/>
                      </svg>
                      <Typography sx={{ fontSize: '14px' }}>Temperature</Typography>
                    </Box>
                  }
                />
              </span>
            </Tooltip>
            {selectedWeatherMetrics.includes('temperature') && (
              <Box sx={{ ml: 4, mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[
                  { color: '#0C4A6E', label: '<-10°C' },
                  { color: '#075985', label: '-10 to -5°C' },
                  { color: '#0369A1', label: '-5 to 0°C' },
                  { color: '#0EA5E9', label: '0-5°C' },
                  { color: '#38BDF8', label: '5-10°C' },
                  { color: '#10B981', label: '10-20°C' },
                  { color: '#FDE047', label: '20-25°C' },
                  { color: '#F59E0B', label: '25-30°C' },
                  { color: '#EF4444', label: '30-35°C' },
                  { color: '#DC2626', label: '>35°C' },
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
