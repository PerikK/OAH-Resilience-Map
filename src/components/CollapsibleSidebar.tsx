import { useState } from 'react'
import { Box, TextField, MenuItem, Typography, Checkbox, FormControlLabel, FormGroup, Tooltip, Button, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSelection, type City, type Site } from '../context/SelectionContext'
import { useCities, useSitesByCity, useHealthRiskBySiteCode, useUrbanParametersBySiteCode } from '../hooks/useApiQueries'

export function CollapsibleSidebar() {
  const [expandedHealthRisk, setExpandedHealthRisk] = useState(false)
  const [expandedResilience, setExpandedResilience] = useState(false)
  const [expandedWeather, setExpandedWeather] = useState(false)
  
  // Get selection state from context
  const {
    city,
    site,
    startDate,
    endDate,
    selectedHealthRisks,
    selectedWeatherMetrics,
    selectedUrbanParameters,
    selectedResilienceMetrics,
    setCity,
    setSite,
    setStartDate,
    setEndDate,
    setSelectedHealthRisks,
    setSelectedWeatherMetrics,
    setSelectedUrbanParameters,
    setSelectedResilienceMetrics,
    toggleHealthRisk,
    toggleWeatherMetric,
    toggleUrbanParameter,
  } = useSelection()

  // Get API data from React Query
  const { data: cities = [], isLoading: isLoadingCities, error: citiesError } = useCities()
  const availableSites = useSitesByCity(city)
  const healthRiskData = useHealthRiskBySiteCode(site && site !== 'all' ? site : null)
  const urbanParametersData = useUrbanParametersBySiteCode(site && site !== 'all' ? site : null)
  
  const hasHealthRiskData = !!healthRiskData
  const hasUrbanParametersData = !!urbanParametersData

  const allHealthRisks: ('pathogen' | 'fecal' | 'arg' | 'overall')[] = ['pathogen', 'fecal', 'arg', 'overall']
  const allWeatherMetrics: ('wind' | 'rainfall' | 'humidity' | 'temperature')[] = ['wind', 'rainfall', 'humidity', 'temperature']
  const allUrbanParameters: ('vegetation' | 'urbanization' | 'imperviousSurface' | 'humanDensity' | 'distances')[] = ['vegetation', 'urbanization', 'imperviousSurface', 'humanDensity', 'distances']

  const handleSelectAllHealthRisks = () => {
    setSelectedHealthRisks(allHealthRisks)
  }

  const handleClearAllHealthRisks = () => {
    setSelectedHealthRisks([])
  }
  
  const handleSelectAllUrbanParameters = () => {
    setSelectedUrbanParameters(allUrbanParameters)
  }

  const handleClearAllUrbanParameters = () => {
    setSelectedUrbanParameters([])
  }

  const handleSelectAllWeather = () => {
    setSelectedWeatherMetrics(allWeatherMetrics)
  }

  const handleClearAllWeather = () => {
    setSelectedWeatherMetrics([])
  }

  const handleClearSelections = () => {
    setCity(null)
    setSite(null)
    setStartDate('2024-01-01')
    setEndDate(new Date().toISOString().split('T')[0])
    // Clear all data selections
    setSelectedHealthRisks([])
    setSelectedResilienceMetrics([])
    setSelectedWeatherMetrics([])
    setSelectedUrbanParameters([])
    // Collapse all accordions
    setExpandedHealthRisk(false)
    setExpandedResilience(false)
    setExpandedWeather(false)
  }


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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '15px' }}>
            Select Parameters
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleClearSelections}
            disabled={!city && !site && selectedHealthRisks.length === 0 && selectedResilienceMetrics.length === 0 && selectedWeatherMetrics.length === 0 && selectedUrbanParameters.length === 0}
            sx={{ 
              fontSize: '11px', 
              textTransform: 'none',
              minWidth: 'auto',
              padding: '4px 12px',
              borderColor: '#DC2626',
              color: '#DC2626',
              '&:hover': { 
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                borderColor: '#DC2626'
              },
              '&:disabled': {
                borderColor: '#E5E7EB',
                color: '#9CA3AF'
              }
            }}
          >
            Clear Selections
          </Button>
        </Box>

        {/* City Selection */}
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ mb: 0.5, fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
            Select an area
          </Typography>
          {isLoadingCities ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Loading cities...</Typography>
            </Box>
          ) : citiesError ? (
            <Typography sx={{ fontSize: '13px', color: 'error.main' }}>{citiesError.message}</Typography>
          ) : (
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
              {cities.map((cityData) => (
                <MenuItem key={cityData.id} value={cityData.id}>
                  {cityData.name}
                </MenuItem>
              ))}
            </TextField>
          )}
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
                <MenuItem key={siteData.code} value={siteData.code}>
                  {siteData.code} - {siteData.name}
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

      {/* Data Selection Accordions */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {/* Health Risk Data Accordion */}
        <Accordion 
          expanded={expandedHealthRisk} 
          onChange={() => setExpandedHealthRisk(!expandedHealthRisk)}
          sx={{ 
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
            '&:before': { display: 'none' },
            mb: 1
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              minHeight: '48px',
              backgroundColor: 'background.default',
              '& .MuiAccordionSummary-content': { 
                alignItems: 'center',
                justifyContent: 'space-between',
                my: 1
              }
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}>
              Health Risk Data
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }} onClick={(e) => e.stopPropagation()}>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!city || !site || site === 'all') return;
                  handleSelectAllHealthRisks();
                }}
                sx={{ 
                  fontSize: '10px', 
                  textTransform: 'none',
                  padding: '2px 6px',
                  color: (!city || !site || site === 'all') ? '#9CA3AF' : '#4A90E2',
                  cursor: (!city || !site || site === 'all') ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  '&:hover': (!city || !site || site === 'all') ? {} : { backgroundColor: 'rgba(74, 144, 226, 0.08)' },
                  userSelect: 'none'
                }}
              >
                All
              </Box>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!city || !site || site === 'all') return;
                  handleClearAllHealthRisks();
                }}
                sx={{ 
                  fontSize: '10px', 
                  textTransform: 'none',
                  padding: '2px 6px',
                  color: (!city || !site || site === 'all') ? '#9CA3AF' : '#6B7280',
                  cursor: (!city || !site || site === 'all') ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  '&:hover': (!city || !site || site === 'all') ? {} : { backgroundColor: 'rgba(107, 114, 128, 0.08)' },
                  userSelect: 'none'
                }}
              >
                Clear
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            {!hasHealthRiskData && site && site !== 'all' ? (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic', py: 1 }}>
                No health risk data available for this site
              </Typography>
            ) : (
              <FormGroup>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasHealthRiskData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasHealthRiskData}
                      control={
                        <Checkbox
                          checked={selectedHealthRisks.includes('pathogen')}
                          onChange={() => toggleHealthRisk('pathogen')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '14px' }}>Pathogen Risk</Typography>
                          {healthRiskData && (
                            <Typography sx={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>
                              {(Number(healthRiskData.scaledPathogenRisk) * 100).toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasHealthRiskData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasHealthRiskData}
                      control={
                        <Checkbox
                          checked={selectedHealthRisks.includes('fecal')}
                          onChange={() => toggleHealthRisk('fecal')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '14px' }}>Fecal Contamination Risk</Typography>
                          {healthRiskData && (
                            <Typography sx={{ fontSize: '11px', color: '#EA580C', fontWeight: 600 }}>
                              {(Number(healthRiskData.scaledFecalRisk) * 100).toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasHealthRiskData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasHealthRiskData}
                      control={
                        <Checkbox
                          checked={selectedHealthRisks.includes('arg')}
                          onChange={() => toggleHealthRisk('arg')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '14px' }}>ARG Risk</Typography>
                          {healthRiskData && (
                            <Typography sx={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>
                              {(Number(healthRiskData.scaledArgRisk) * 100).toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasHealthRiskData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasHealthRiskData}
                      control={
                        <Checkbox
                          checked={selectedHealthRisks.includes('overall')}
                          onChange={() => toggleHealthRisk('overall')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' } }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '14px' }}>Overall Health Risk Score</Typography>
                          {healthRiskData && (
                            <Typography sx={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>
                              {(Number(healthRiskData.healthRiskScore) * 100).toFixed(1)}%
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </span>
                </Tooltip>
              </FormGroup>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Urban Parameters Accordion */}
        <Accordion 
          expanded={expandedResilience} 
          onChange={() => setExpandedResilience(!expandedResilience)}
          sx={{ 
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
            '&:before': { display: 'none' },
            mb: 1
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              minHeight: '48px',
              backgroundColor: 'background.default',
              '& .MuiAccordionSummary-content': { 
                alignItems: 'center',
                justifyContent: 'space-between',
                my: 1
              }
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}>
              Urban Parameters
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }} onClick={(e) => e.stopPropagation()}>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!city || !site || site === 'all' || !hasUrbanParametersData) return;
                  handleSelectAllUrbanParameters();
                }}
                sx={{ 
                  fontSize: '10px', 
                  textTransform: 'none',
                  padding: '2px 6px',
                  color: (!city || !site || site === 'all' || !hasUrbanParametersData) ? '#9CA3AF' : '#4A90E2',
                  cursor: (!city || !site || site === 'all' || !hasUrbanParametersData) ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  '&:hover': (!city || !site || site === 'all' || !hasUrbanParametersData) ? {} : { backgroundColor: 'rgba(74, 144, 226, 0.08)' },
                  userSelect: 'none'
                }}
              >
                All
              </Box>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!city || !site || site === 'all' || !hasUrbanParametersData) return;
                  handleClearAllUrbanParameters();
                }}
                sx={{ 
                  fontSize: '10px', 
                  textTransform: 'none',
                  padding: '2px 6px',
                  color: (!city || !site || site === 'all' || !hasUrbanParametersData) ? '#9CA3AF' : '#6B7280',
                  cursor: (!city || !site || site === 'all' || !hasUrbanParametersData) ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  '&:hover': (!city || !site || site === 'all' || !hasUrbanParametersData) ? {} : { backgroundColor: 'rgba(107, 114, 128, 0.08)' },
                  userSelect: 'none'
                }}
              >
                Clear
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            {!hasUrbanParametersData && site && site !== 'all' ? (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic', py: 1 }}>
                No urban parameters data available for this site
              </Typography>
            ) : (
              <FormGroup>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasUrbanParametersData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasUrbanParametersData}
                      control={
                        <Checkbox
                          checked={selectedUrbanParameters.includes('vegetation')}
                          onChange={() => toggleUrbanParameter('vegetation')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' }, padding: '4px' }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '12px' }}>Vegetation Cover & Density</Typography>}
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasUrbanParametersData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasUrbanParametersData}
                      control={
                        <Checkbox
                          checked={selectedUrbanParameters.includes('urbanization')}
                          onChange={() => toggleUrbanParameter('urbanization')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' }, padding: '4px' }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '12px' }}>Urbanization Percentage</Typography>}
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasUrbanParametersData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasUrbanParametersData}
                      control={
                        <Checkbox
                          checked={selectedUrbanParameters.includes('imperviousSurface')}
                          onChange={() => toggleUrbanParameter('imperviousSurface')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' }, padding: '4px' }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '12px' }}>Impervious Surface</Typography>}
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasUrbanParametersData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasUrbanParametersData}
                      control={
                        <Checkbox
                          checked={selectedUrbanParameters.includes('humanDensity')}
                          onChange={() => toggleUrbanParameter('humanDensity')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' }, padding: '4px' }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '12px' }}>Human Density Proxy</Typography>}
                    />
                  </span>
                </Tooltip>
                <Tooltip title={!city || !site || site === 'all' ? 'Please select a City and a Site first' : !hasUrbanParametersData ? 'No data available for this site' : ''} arrow>
                  <span>
                    <FormControlLabel
                      disabled={!city || !site || site === 'all' || !hasUrbanParametersData}
                      control={
                        <Checkbox
                          checked={selectedUrbanParameters.includes('distances')}
                          onChange={() => toggleUrbanParameter('distances')}
                          sx={{ '&.Mui-checked': { color: '#4A90E2' }, padding: '4px' }}
                        />
                      }
                      label={<Typography sx={{ fontSize: '12px' }}>Distances to Infrastructure</Typography>}
                    />
                  </span>
                </Tooltip>
              </FormGroup>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Weather Data Accordion */}
        <Accordion 
          expanded={expandedWeather} 
          onChange={() => setExpandedWeather(!expandedWeather)}
          sx={{ 
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
            '&:before': { display: 'none' },
            mb: 1
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              minHeight: '48px',
              backgroundColor: 'background.default',
              '& .MuiAccordionSummary-content': { 
                alignItems: 'center',
                justifyContent: 'space-between',
                my: 1
              }
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}>
              Weather Data
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }} onClick={(e) => e.stopPropagation()}>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!city || !site || site === 'all') return;
                  handleSelectAllWeather();
                }}
                sx={{ 
                  fontSize: '10px', 
                  textTransform: 'none',
                  padding: '2px 6px',
                  color: (!city || !site || site === 'all') ? '#9CA3AF' : '#4A90E2',
                  cursor: (!city || !site || site === 'all') ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  '&:hover': (!city || !site || site === 'all') ? {} : { backgroundColor: 'rgba(74, 144, 226, 0.08)' },
                  userSelect: 'none'
                }}
              >
                All
              </Box>
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!city || !site || site === 'all') return;
                  handleClearAllWeather();
                }}
                sx={{ 
                  fontSize: '10px', 
                  textTransform: 'none',
                  padding: '2px 6px',
                  color: (!city || !site || site === 'all') ? '#9CA3AF' : '#6B7280',
                  cursor: (!city || !site || site === 'all') ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  '&:hover': (!city || !site || site === 'all') ? {} : { backgroundColor: 'rgba(107, 114, 128, 0.08)' },
                  userSelect: 'none'
                }}
              >
                Clear
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
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
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}
