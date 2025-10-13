import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { useSelection } from '../context/SelectionContext'
import { styled } from '@mui/material/styles'

const colors = ['#DC2626', '#EA580C', '#D97706']

const EmptyStateContainer = styled(Box)({ 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '350px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #d1d5db'
})

export function CategoryChart() {
  const { site } = useSelection()
  
  const data = useMemo(() => {
    if (!site || site === 'all') return []
    
    const healthData = getHealthRiskForSite(site)
    if (!healthData) return []
    
    return [
      {
        category: 'Pathogen',
        value: healthData.scaled_Pathogen_Risk * 100,
      },
      {
        category: 'Fecal',
        value: healthData.scaled_Fecal_Risk * 100,
      },
      {
        category: 'ARG',
        value: healthData.scaled_ARG_Risk * 100,
      },
      {
        category: 'Overall',
        value: healthData.health_risk_score * 100,
      },
    ]
  }, [site])
  
  if (data.length === 0) {
    return (
      <EmptyStateContainer>
        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          Select a specific site to view health risk breakdown
        </Typography>
      </EmptyStateContainer>
    )
  }
  
  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis 
            type="category" 
            dataKey="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={75}
          />
          <Bar dataKey="value" fill={colors[0]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

