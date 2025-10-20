import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material'
import { useSelection } from '../context/SelectionContext'
import { useSiteByCode, useUrbanParametersBySiteCode } from '../hooks/useApiQueries'

export function UrbanParametersTable() {
  const { site, selectedUrbanParameters } = useSelection()
  const siteData = useSiteByCode(site)
  const urbanParams = useUrbanParametersBySiteCode(site && site !== 'all' ? site : null)
  
  if (!site || site === 'all') {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select a specific site to view urban parameters
        </Typography>
      </Box>
    )
  }

  if (!urbanParams) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No urban parameters data available for this site
        </Typography>
      </Box>
    )
  }

  // Map selection to parameter groups
  const categoryMap: Record<string, { title: string; params: Array<{ label: string; value: number | null; unit: string; multiply?: number }> }> = {
    distances: {
      title: 'Distances to Infrastructure',
      params: [
        { label: 'Distance to Hospitals', value: urbanParams.distanceToHospitals, unit: 'm' },
        { label: 'Distance to Living Street/Road', value: urbanParams.distanceToLivingStreetRoad, unit: 'm' },
        { label: 'Distance to Motorway Road', value: urbanParams.distanceToMotorwayRoad, unit: 'm' },
        { label: 'Distance to Sewage Stations', value: urbanParams.distanceToSewageStations, unit: 'm' },
        { label: 'Distance to Agricultural Fields', value: urbanParams.distChampCulture, unit: 'm' },
      ]
    },
    vegetation: {
      title: 'Vegetation Cover (at different radii)',
      params: [
        { label: 'Vegetation Cover 50m', value: urbanParams.vegCoverFrac50m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 100m', value: urbanParams.vegCoverFrac100m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 250m', value: urbanParams.vegCoverFrac250m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 500m', value: urbanParams.vegCoverFrac500m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 750m', value: urbanParams.vegCoverFrac750m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 1000m', value: urbanParams.vegCoverFrac1000m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 1500m', value: urbanParams.vegCoverFrac1500m, unit: '%', multiply: 100 },
        { label: 'Vegetation Cover 2000m', value: urbanParams.vegCoverFrac2000m, unit: '%', multiply: 100 },
      ]
    },
    urbanization: {
      title: 'Urbanization Percentage (at different radii)',
      params: [
        { label: 'Urban % 50m', value: urbanParams.urbanPct50m, unit: '%' },
        { label: 'Urban % 100m', value: urbanParams.urbanPct100m, unit: '%' },
        { label: 'Urban % 250m', value: urbanParams.urbanPct250m, unit: '%' },
        { label: 'Urban % 500m', value: urbanParams.urbanPct500m, unit: '%' },
        { label: 'Urban % 750m', value: urbanParams.urbanPct750m, unit: '%' },
        { label: 'Urban % 1000m', value: urbanParams.urbanPct1000m, unit: '%' },
        { label: 'Urban % 1500m', value: urbanParams.urbanPct1500m, unit: '%' },
        { label: 'Urban % 2000m', value: urbanParams.urbanPct2000m, unit: '%' },
      ]
    },
    imperviousSurface: {
      title: 'Impervious Surface Percentage (at different radii)',
      params: [
        { label: 'Impervious % 50m', value: urbanParams.imperviousPct50m, unit: '%' },
        { label: 'Impervious % 100m', value: urbanParams.imperviousPct100m, unit: '%' },
        { label: 'Impervious % 250m', value: urbanParams.imperviousPct250m, unit: '%' },
        { label: 'Impervious % 500m', value: urbanParams.imperviousPct500m, unit: '%' },
        { label: 'Impervious % 750m', value: urbanParams.imperviousPct750m, unit: '%' },
        { label: 'Impervious % 1000m', value: urbanParams.imperviousPct1000m, unit: '%' },
        { label: 'Impervious % 1500m', value: urbanParams.imperviousPct1500m, unit: '%' },
        { label: 'Impervious % 2000m', value: urbanParams.imperviousPct2000m, unit: '%' },
      ]
    },
    humanDensity: {
      title: 'Human Density Proxy (at different radii)',
      params: [
        { label: 'Human Density 50m', value: urbanParams.humanDensityProxy50m, unit: '' },
        { label: 'Human Density 100m', value: urbanParams.humanDensityProxy100m, unit: '' },
        { label: 'Human Density 250m', value: urbanParams.humanDensityProxy250m, unit: '' },
        { label: 'Human Density 500m', value: urbanParams.humanDensityProxy500m, unit: '' },
        { label: 'Human Density 750m', value: urbanParams.humanDensityProxy750m, unit: '' },
        { label: 'Human Density 1000m', value: urbanParams.humanDensityProxy1000m, unit: '' },
        { label: 'Human Density 1500m', value: urbanParams.humanDensityProxy1500m, unit: '' },
        { label: 'Human Density 2000m', value: urbanParams.humanDensityProxy2000m, unit: '' },
      ]
    },
  }

  // Filter to show only selected categories
  const parameterGroups = selectedUrbanParameters.map(category => categoryMap[category]).filter(Boolean)

  if (parameterGroups.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select urban parameter categories from the sidebar to view data
        </Typography>
      </Box>
    )
  }


  const formatValue = (param: { value: number | null; multiply?: number }) => {
    if (param.value === null || param.value === undefined) return 'N/A'
    const finalValue = param.multiply ? Number(param.value) * param.multiply : Number(param.value)
    return finalValue.toFixed(2)
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Urban Parameters for {siteData?.name || site}
      </Typography>
      
      {parameterGroups.map((group, groupIndex) => (
        <Box key={groupIndex} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
            {group.title}
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Parameter</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Value</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'text.primary' }}>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.params.map((param, paramIndex) => (
                  <TableRow 
                    key={paramIndex}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{param.label}</TableCell>
                    <TableCell align="right">
                      {formatValue(param)}
                    </TableCell>
                    <TableCell align="right">{param.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
      
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Note:</strong> Radii measurements (50m, 100m, 250m, etc.) indicate the buffer zone around the site where the parameter was measured.
        </Typography>
      </Box>
    </Box>
  )
}
