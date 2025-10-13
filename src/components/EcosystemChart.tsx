import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { useSelection } from '../context/SelectionContext'
import { styled } from '@mui/material/styles'

const EmptyStateContainer = styled(Box)({ 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '300px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px dashed #d1d5db'
})

export function EcosystemChart() {
  const { site } = useSelection()
  
  const data = useMemo(() => {
    if (!site || site === 'all') return []
    
    const healthData = getHealthRiskForSite(site)
    if (!healthData) return []
    
    return [
      {
        name: 'Pathogen Risk',
        value: Math.round(healthData.scaled_Pathogen_Risk * 100),
        color: '#DC2626'
      },
      {
        name: 'Fecal Risk',
        value: Math.round(healthData.scaled_Fecal_Risk * 100),
        color: '#EA580C'
      },
      {
        name: 'ARG Risk',
        value: Math.round(healthData.scaled_ARG_Risk * 100),
        color: '#D97706'
      },
    ]
  }, [site])
  
  if (data.length === 0) {
    return (
      <EmptyStateContainer>
        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          Select a specific site to view health risk distribution
        </Typography>
      </EmptyStateContainer>
    )
  }
  
  return (
    <Box sx={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        {data.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: entry.color, 
                borderRadius: '50%' 
              }} 
            />
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {entry.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {entry.value}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
