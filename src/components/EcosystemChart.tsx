import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'

const data = [
  { name: 'Ecosystem Engaged', value: 40, color: '#3b82f6' },
  { name: 'Maintained', value: 60, color: '#8b5cf6' },
]

const EcosystemChart: React.FC = () => {
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

export default EcosystemChart
