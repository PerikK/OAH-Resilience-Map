import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useSelection } from '../context/SelectionContext'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { getSite } from '../data/researchSites'
import { getLatestResilienceData } from '../data/resilienceData'

export function HealthRiskTable() {
  const { city, site, selectedHealthRisks, selectedResilienceMetrics } = useSelection()

  // Don't show table if no site selected or no metrics selected
  if (!city || !site || site === 'all' || (selectedHealthRisks.length === 0 && selectedResilienceMetrics.length === 0)) {
    return null
  }

  const healthData = getHealthRiskForSite(site)
  const resilienceData = getLatestResilienceData(site)
  const siteData = getSite(city, site)

  if (!siteData) {
    return (
      <Box sx={{ padding: 3, backgroundColor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
          No data available for {site}
        </Typography>
      </Box>
    )
  }

  const getRiskLabel = (metric: string): string => {
    switch (metric) {
      case 'pathogen':
        return 'Pathogen Risk'
      case 'fecal':
        return 'Fecal Contamination Risk'
      case 'arg':
        return 'ARG Risk'
      case 'overall':
        return 'Overall Health Risk Score'
      default:
        return metric
    }
  }

  const getResilienceLabel = (metric: string): string => {
    switch (metric) {
      case 'waterQuality':
        return 'Water Resources & Quality'
      case 'biodiversity':
        return 'Biodiversity & Habitats'
      case 'riverbankProtection':
        return 'Riverbank Protection'
      case 'airQuality':
        return 'Air Quality'
      case 'landUse':
        return 'Sustainable Land Use & Agriculture'
      case 'wasteReduction':
        return 'Waste Reduction'
      default:
        return metric
    }
  }

  const getRiskValue = (metric: string): number | null => {
    if (!healthData) return null
    switch (metric) {
      case 'pathogen':
        return healthData.scaled_Pathogen_Risk
      case 'fecal':
        return healthData.scaled_Fecal_Risk
      case 'arg':
        return healthData.scaled_ARG_Risk
      case 'overall':
        return healthData.health_risk_score
      default:
        return null
    }
  }

  const getResilienceValue = (metric: string): number | null => {
    if (!resilienceData) return null
    switch (metric) {
      case 'waterQuality':
        return resilienceData['Water Resources & Quality']
      case 'biodiversity':
        return resilienceData['Biodiversity & Habitats']
      case 'riverbankProtection':
        return resilienceData['Riverbank Protection']
      case 'airQuality':
        return resilienceData['Air Quality']
      case 'landUse':
        return resilienceData['Sustainable Land Use & Agriculture']
      case 'wasteReduction':
        return resilienceData['Waste Reduction']
      default:
        return null
    }
  }

  const getRiskColor = (value: number): string => {
    if (value < 0.25) return '#10B981' // Green - Low risk
    if (value < 0.5) return '#F59E0B' // Orange - Moderate risk
    if (value < 0.75) return '#EF4444' // Red - High risk
    return '#DC2626' // Dark red - Very high risk
  }

  const getRiskSymbol = (value: number) => {
    const color = getRiskColor(value)
    
    if (value < 0.25) {
      // Low risk - downward triangle
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <polygon points="8,12 2,4 14,4" fill={color} />
        </svg>
      )
    } else if (value < 0.5) {
      // Moderate risk - parallelogram (dash)
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <polygon points="3,6 13,6 13,10 3,10" fill={color} />
        </svg>
      )
    } else {
      // High/Very High risk - upward triangle
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <polygon points="8,4 14,12 2,12" fill={color} />
        </svg>
      )
    }
  }

  return (
    <Box sx={{ backgroundColor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ padding: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Site Data
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {siteData['Site Nr.']} - {siteData['Site Name']}, {city}
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
                Level
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderColor: 'divider', width: '40px' }} align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: 'background.paper' }}>
            {/* Health Risk Metrics */}
            {selectedHealthRisks.map((metric) => {
              const value = getRiskValue(metric)
              if (value === null) return null
              const color = getRiskColor(value)
              return (
                <TableRow key={metric} hover sx={{ backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' } }}>
                  <TableCell sx={{ borderColor: 'divider', color: 'text.primary' }}>{getRiskLabel(metric)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                    {value.toFixed(3)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderColor: 'divider' }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: `${color}20`,
                        color: color,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {value < 0.25 ? 'Low' : value < 0.5 ? 'Moderate' : value < 0.75 ? 'High' : 'Very High'}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '8px', borderColor: 'divider' }}>
                    {getRiskSymbol(value)}
                  </TableCell>
                </TableRow>
              )
            })}
            
            {/* Resilience Metrics */}
            {selectedResilienceMetrics.map((metric) => {
              const value = getResilienceValue(metric)
              if (value === null) {
                return (
                  <TableRow key={metric} hover sx={{ backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell sx={{ borderColor: 'divider', color: 'text.primary' }}>{getResilienceLabel(metric)}</TableCell>
                    <TableCell align="right" colSpan={3} sx={{ borderColor: 'divider', color: 'text.secondary', fontStyle: 'italic' }}>
                      No data available for this site
                    </TableCell>
                  </TableRow>
                )
              }
              // Resilience values are 0-100 scale
              const normalizedValue = value / 100
              const color = normalizedValue < 0.25 ? '#EF4444' : normalizedValue < 0.5 ? '#F59E0B' : normalizedValue < 0.75 ? '#10B981' : '#059669'
              return (
                <TableRow key={metric} hover sx={{ backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' } }}>
                  <TableCell sx={{ borderColor: 'divider', color: 'text.primary' }}>{getResilienceLabel(metric)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                    {value.toFixed(1)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderColor: 'divider' }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: `${color}20`,
                        color: color,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {normalizedValue < 0.25 ? 'Very Low' : normalizedValue < 0.5 ? 'Low' : normalizedValue < 0.75 ? 'Good' : 'Excellent'}
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '8px', borderColor: 'divider' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6" fill={color} />
                    </svg>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
