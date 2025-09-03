import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getEcosystemDistribution } from '../mock_data/ecosystem'
import { useSelection } from '../context/SelectionContext'
import { hasDataForSite, getLatestResilienceData } from '../data/resilienceData'

 

export function EcosystemChart() {
  const { city, site } = useSelection()
  const data = useMemo(() => {
    // Use real data for Coimbra C1
    if (hasDataForSite(city, site)) {
      const realData = getLatestResilienceData()
      if (realData) {
        return [
          {
            name: 'Ecosystem Engagement',
            value: Math.round(realData['Ecosystem Engagement (%)']),
            color: '#4f46e5'
          },
          {
            name: 'Maintained Areas',
            value: Math.round(realData['Maintained (%)']),
            color: '#7c3aed'
          },
          {
            name: 'Natural Habitat',
            value: Math.round(realData['Natural Habitat']),
            color: '#059669'
          },
          {
            name: 'Biodiversity',
            value: Math.round(realData['Biodiversity']),
            color: '#dc2626'
          }
        ]
      }
    }
    
    // Fallback to mock data
    return getEcosystemDistribution(city, site)
  }, [city, site])
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
