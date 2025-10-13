import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { useSelection } from '../context/SelectionContext'
import { styled } from '@mui/material/styles'

export type ResilienceChartProps = {
  height?: number
}

const EmptyStateContainer = styled(Box)({ 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #d1d5db'
})

export function ResilienceChart({ height = 300 }: ResilienceChartProps) {
  const { site } = useSelection()
  
  const data = useMemo(() => {
    if (!site || site === 'all') return []
    
    const healthData = getHealthRiskForSite(site)
    if (!healthData) return []
    
    return [
      { name: 'Pathogen', value: healthData.scaled_Pathogen_Risk * 100 },
      { name: 'Fecal', value: healthData.scaled_Fecal_Risk * 100 },
      { name: 'ARG', value: healthData.scaled_ARG_Risk * 100 },
      { name: 'Overall', value: healthData.health_risk_score * 100 },
    ]
  }, [site])
  
  if (data.length === 0) {
    return (
      <EmptyStateContainer sx={{ width: '100%', height }}>
        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          Select a specific site to view health risk scores
        </Typography>
      </EmptyStateContainer>
    )
  }
  
  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#6b7280', fontSize: 12 } }}
          />
          <Bar 
            dataKey="value" 
            fill="#DC2626" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

