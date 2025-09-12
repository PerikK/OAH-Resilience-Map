import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getCategoryBars } from '../mock_data/categories'
import { useSelection } from '../context/SelectionContext'
import { hasDataForSite, getLatestResilienceData } from '../data/resilienceData'
import { styled } from '@mui/material/styles'

 

const colors = ['#4f46e5', '#7c3aed', '#8b5cf6']

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
  const { city, site } = useSelection()
  const data = useMemo(() => {
    if (!city) {
      return []
    }
    
    // Use real data for Coimbra C1
    if (city && site && hasDataForSite(city, site)) {
      const realData = getLatestResilienceData()
      if (realData) {
        return [
          {
            category: 'Water Quality',
            dataset1: realData['Water Resources & Quality'],
            dataset2: realData['Water Quality'],
            dataset3: realData['Riverbank Protection']
          },
          {
            category: 'Biodiversity',
            dataset1: realData['Biodiversity & Habitats'],
            dataset2: realData['Biodiversity'],
            dataset3: realData['Natural Habitat']
          },
          {
            category: 'Environment',
            dataset1: realData['Air Quality'],
            dataset2: realData['Climate Adaptation'],
            dataset3: realData['Sustainable Land Use & Agriculture']
          },
          {
            category: 'Engagement',
            dataset1: realData['Ecosystem Engagement (%)'],
            dataset2: realData['Maintained (%)'],
            dataset3: realData['Waste Reduction']
          }
        ]
      }
    }
    
    // Fallback to mock data
    return getCategoryBars(city, site)
  }, [city, site])
  
  if (!city) {
    return (
      <EmptyStateContainer>
        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
          Please select a city to view category data
        </Typography>
      </EmptyStateContainer>
    )
  }
  
  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: colors[0], borderRadius: '50%' }} />
          <Typography variant="caption">Dataset 1</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: colors[1], borderRadius: '50%' }} />
          <Typography variant="caption">Dataset 2</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: colors[2], borderRadius: '50%' }} />
          <Typography variant="caption">Dataset 3</Typography>
        </Box>
      </Box>
      
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
          <Bar dataKey="dataset1" fill={colors[0]} radius={[0, 4, 4, 0]} />
          <Bar dataKey="dataset2" fill={colors[1]} radius={[0, 4, 4, 0]} />
          <Bar dataKey="dataset3" fill={colors[2]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}

