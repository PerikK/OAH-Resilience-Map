import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { getCategoryBars } from '../mock_data/categories'
import { useSelection } from '../context/SelectionContext'

 

const colors = ['#4f46e5', '#7c3aed', '#8b5cf6']

export function CategoryChart() {
  const { city, site } = useSelection()
  const data = useMemo(() => getCategoryBars(city, site), [city, site])
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

