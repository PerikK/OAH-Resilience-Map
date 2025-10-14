import { Box } from '@mui/material'
import { TopBar } from './TopBar'
import { CollapsibleSidebar } from './CollapsibleSidebar'
import { CityMap } from './CityMap'
import { HealthRiskTable } from './HealthRiskTable'
import { WeatherDataTable } from './WeatherDataTable'
import { useSelection } from '../context/SelectionContext'

export function ResilienceMap() {
  const { city, site, selectedHealthRisks, selectedWeatherMetrics, selectedResilienceMetrics } = useSelection()
  
  // Determine if we have data to show (map should shrink)
  const hasData = city && site && site !== 'all' && (selectedHealthRisks.length > 0 || selectedWeatherMetrics.length > 0 || selectedResilienceMetrics.length > 0)
  
  // Map height: 80vh when no data, 50vh when data is available (to show tables)
  const mapHeight = hasData ? '50vh' : '80vh'

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
            overflow: 'hidden',
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
            {/* Tables Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: 3,
              }}
            >
              {/* Health Risk Table */}
              <HealthRiskTable />

              {/* Weather Data Table */}
              <WeatherDataTable />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

