import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useMemo } from 'react'
import { getMapPoints, type MapPoint } from '../mock_data/map'
import { useSelection } from '../context/SelectionContext'

const MapContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '560px',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  overflow: 'hidden',
})

const MapSvg = styled('svg')({
  width: '100%',
  height: '100%',
})

const MapDot = styled('circle')(() => ({
  fill: '#6366f1',
  opacity: 0.7,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.1)',
  },
}))

const Legend = styled(Box)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: 'white',
  padding: '12px',
  borderRadius: '6px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
})

const LegendItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
  '&:last-child': {
    marginBottom: 0,
  },
})

const LegendDot = styled('div')<{ size: number }>(({ size }) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  backgroundColor: '#6366f1',
}))

export function CityMap() {
  const { city, site } = useSelection()
  const points = useMemo(() => getMapPoints(city, site), [city, site])
  return (
    <MapContainer>
      <MapSvg viewBox="0 0 400 400">
        {/* Simple map outline */}
        <path
          d="M50 50 L350 50 L350 350 L50 350 Z M80 100 Q120 80 160 100 T240 120 Q280 140 320 120 L320 300 Q280 320 240 300 T160 280 Q120 300 80 280 Z"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        
        {/* Map dots */}
        {points.map((point: MapPoint, index: number) => (
          <MapDot
            key={index}
            cx={point.x}
            cy={point.y}
            r={point.size}
          >
            <title>{`Value: ${point.value}`}</title>
          </MapDot>
        ))}
      </MapSvg>
      
      <Legend>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Size
        </Typography>
        <LegendItem>
          <LegendDot size={4} />
          <Typography variant="caption">0</Typography>
        </LegendItem>
        <LegendItem>
          <LegendDot size={8} />
          <Typography variant="caption">5</Typography>
        </LegendItem>
        <LegendItem>
          <LegendDot size={12} />
          <Typography variant="caption">10</Typography>
        </LegendItem>
      </Legend>
    </MapContainer>
  )
}
