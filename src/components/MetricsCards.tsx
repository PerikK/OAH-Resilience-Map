import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material'
import { useMemo } from 'react'
import { getMetrics, type Metric } from '../mock_data/metrics'
import { useSelection } from '../context/SelectionContext'
import { styled } from '@mui/material/styles'

const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  borderRadius: theme.spacing(1),
}))

const ProgressContainer = styled(Box)({
  marginTop: '12px',
  marginBottom: '8px',
})

const StyledLinearProgress = styled(LinearProgress)<{ bgcolor?: string }>(({ bgcolor }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e5e7eb',
  '& .MuiLinearProgress-bar': {
    backgroundColor: bgcolor || '#3b82f6',
    borderRadius: 4,
  },
}))

interface MetricCardProps {
  title: string
  value: string
  percentage: number
  subtitle: string
  color: string
  bgColor: string
}

function MetricCardComponent({ 
  title, 
  value, 
  percentage, 
  subtitle, 
  bgColor 
}: MetricCardProps) {
  return (
  <MetricCard>
    <CardContent sx={{ backgroundColor: bgColor, color: 'white', textAlign: 'center', py: 3 }}>
      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      <ProgressContainer>
        <StyledLinearProgress 
          variant="determinate" 
          value={percentage} 
          bgcolor="rgba(255,255,255,0.3)"
        />
      </ProgressContainer>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {subtitle}
      </Typography>
    </CardContent>
  </MetricCard>
  )
}

export function MetricsCards() {
  const { city, site } = useSelection()
  const metrics = useMemo(() => getMetrics(city, site), [city, site])

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(5, 1fr)',
        },
      }}
    >
      {metrics.map((metric: Metric, index: number) => (
        <Box key={index}>
          <MetricCardComponent {...metric} />
        </Box>
      ))}
    </Box>
  )
}
