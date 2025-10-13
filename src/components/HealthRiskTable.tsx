import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useSelection } from '../context/SelectionContext'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { getSite } from '../data/researchSites'

export function HealthRiskTable() {
  const { city, site, selectedHealthRisks } = useSelection()

  // Don't show table if no site selected or no health risks selected
  if (!city || !site || site === 'all' || selectedHealthRisks.length === 0) {
    return null
  }

  const healthData = getHealthRiskForSite(site)
  const siteData = getSite(city, site)

  if (!healthData || !siteData) {
    return (
      <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
        <Typography sx={{ color: '#6B7280', textAlign: 'center' }}>
          No health risk data available for {site}
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

  const getRiskValue = (metric: string): number => {
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
        return 0
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
    <Box sx={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <Box sx={{ padding: 3, borderBottom: '1px solid #E5E7EB' }}>
        <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 600 }}>
          Health Risk Data
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
          {siteData['Site Nr.']} - {siteData['Site Name']}, {city}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Risk Metric</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }} align="right">
                Score
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }} align="center">
                Risk Level
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', width: '40px' }} align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedHealthRisks.map((metric) => {
              const value = getRiskValue(metric)
              const color = getRiskColor(value)
              return (
                <TableRow key={metric} hover>
                  <TableCell>{getRiskLabel(metric)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {value.toFixed(3)}
                  </TableCell>
                  <TableCell align="center">
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
                  <TableCell align="center" sx={{ padding: '8px' }}>
                    {getRiskSymbol(value)}
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
