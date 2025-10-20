import { Box } from '@mui/material'
import { TopBar } from './TopBar'
import { CollapsibleSidebar } from './CollapsibleSidebar'
import { CityMap } from './CityMap'
import { WeatherDataTable } from './WeatherDataTable'
import { UrbanParametersTable } from './UrbanParametersTable'
import { useSelection } from '../context/SelectionContext'

export function ResilienceMap() {
  const { city, site, selectedWeatherMetrics, selectedUrbanParameters, selectedResilienceMetrics } = useSelection()
  
  // Determine if we have data to show (map should shrink)
  const hasData = city && site && site !== 'all' && (selectedWeatherMetrics.length > 0 || selectedUrbanParameters.length > 0 || selectedResilienceMetrics.length > 0)
  
  // Map height: 85vh when no data, 60vh when urban params shown (large table), 70vh for weather only
  const mapHeight = selectedUrbanParameters.length > 0 ? '50vh' : hasData ? '70vh' : '85vh'

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        width: '100vw',
        paddingTop: '60px', // Account for fixed TopBar
      }}
    >
      <TopBar />
      <CollapsibleSidebar />

      {/* Main Content Area */}
      <Box
        sx={{
          marginLeft: '40px', // Left margin
          marginRight: '400px', // Account for right sidebar
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        {/* Map Container */}
        <Box
          sx={{
            height: mapHeight,
            transition: 'height 0.5s ease-in-out',
            position: 'relative',
            overflow: 'hidden', // Clip content to prevent cards from overflowing when scrolling
            isolation: 'isolate', // Create new stacking context to contain z-index
          }}
        >
          <CityMap />
        </Box>

        {/* Data Tables Area - Only show when we have data */}
        {hasData && (
          <Box
            sx={{
              flex: 1,
              padding: '24px',
              backgroundColor: 'background.default',
              overflowY: 'auto',
            }}
          >
            {/* Weather Data Table */}
            {selectedWeatherMetrics.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <WeatherDataTable />
              </Box>
            )}

            {/* Urban Parameters Table - Full Width */}
            {selectedUrbanParameters.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <UrbanParametersTable />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

