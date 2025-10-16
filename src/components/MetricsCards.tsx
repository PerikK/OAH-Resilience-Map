import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material'
import { useMemo } from 'react'
import { getHealthRiskForSite } from '../data/healthRiskData'
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
  const { site } = useSelection()
  
  const metrics = useMemo(() => {
    if (!site || site === 'all') return []
    
    const healthData = getHealthRiskForSite(site)
    if (!healthData) return []
    
    return [
      {
        title: 'Pathogen Risk',
        value: `${(healthData.scaled_Pathogen_Risk * 100).toFixed(1)}%`,
        percentage: healthData.scaled_Pathogen_Risk * 100,
        subtitle: 'Scaled Risk Score',
        color: '#DC2626',
        bgColor: '#DC2626',
      },
      {
        title: 'Fecal Contamination',
        value: `${(healthData.scaled_Fecal_Risk * 100).toFixed(1)}%`,
        percentage: healthData.scaled_Fecal_Risk * 100,
        subtitle: 'Scaled Risk Score',
        color: '#EA580C',
        bgColor: '#EA580C',
      },
      {
        title: 'ARG Risk',
        value: `${(healthData.scaled_ARG_Risk * 100).toFixed(1)}%`,
        percentage: healthData.scaled_ARG_Risk * 100,
        subtitle: 'Scaled Risk Score',
        color: '#D97706',
        bgColor: '#D97706',
      },
      {
        title: 'Overall Health Risk',
        value: `${(healthData.health_risk_score * 100).toFixed(1)}%`,
        percentage: healthData.health_risk_score * 100,
        subtitle: 'Combined Score',
        color: '#7C3AED',
        bgColor: '#7C3AED',
      },
    ]
  }, [site])

  if (metrics.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Select a specific site to view health risk metrics
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        flexWrap: 'nowrap',
      }}
    >
      {metrics.map((metric, index) => (
        <Box key={index} sx={{ minWidth: 0, flex: '0 0 auto' }}>
          <MetricCardComponent {...metric} />
        </Box>
      ))}
    </Box>
  )
}
