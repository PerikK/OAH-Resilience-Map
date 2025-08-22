import React from 'react'
import { Grid, Card, CardContent, Typography, LinearProgress, Box } from '@mui/material'
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

const MetricCardComponent: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  percentage, 
  subtitle, 
  color,
  bgColor 
}) => (
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

const MetricsCards: React.FC = () => {
  const metrics = [
    {
      title: 'Water Resources & Quality',
      value: '29%',
      percentage: 29,
      subtitle: 'vs prev 15%',
      color: '#1e40af',
      bgColor: '#1e40af',
    },
    {
      title: 'Biodiversity & Habitats',
      value: '29%',
      percentage: 29,
      subtitle: 'vs prev 25%',
      color: '#7c3aed',
      bgColor: '#7c3aed',
    },
    {
      title: 'Riverbank Protection',
      value: '32.5%',
      percentage: 32.5,
      subtitle: 'vs prev 30%',
      color: '#0891b2',
      bgColor: '#0891b2',
    },
    {
      title: 'Air Quality',
      value: '10%',
      percentage: 10,
      subtitle: 'vs prev 8%',
      color: '#1f2937',
      bgColor: '#1f2937',
    },
    {
      title: 'Sustainable Land Use & Agriculture',
      value: '62%',
      percentage: 62,
      subtitle: 'vs prev 55%',
      color: '#312e81',
      bgColor: '#312e81',
    },
  ]

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={2.4} key={index}>
          <MetricCardComponent {...metric} />
        </Grid>
      ))}
    </Grid>
  )
}

export default MetricsCards
