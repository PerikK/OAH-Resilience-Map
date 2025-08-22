import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { Box, Typography } from '@mui/material'

const data = [
  { month: 'Jan 25', current: 0.75, previous: 0.65 },
  { month: 'Feb 25', current: 0.72, previous: 0.68 },
  { month: 'Mar 25', current: 0.85, previous: 0.78 },
  { month: 'Apr 25', current: 0.82, previous: 0.75 },
  { month: 'May 25', current: 1.05, previous: 0.95 },
  { month: 'Jun 25', current: 0.95, previous: 0.88 },
  { month: 'Jul 25', current: 0.88, previous: 0.82 },
]

const ResilienceChart: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 1.25]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => value.toFixed(2)}
            label={{ value: 'Resilience Index', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#6b7280', fontSize: 12 } }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
            align="right"
            wrapperStyle={{ paddingBottom: '20px', color: '#4f46e5' }}
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#4f46e5" 
            strokeWidth={2}
            dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
            name="Current"
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            name="Previous"
          />
        </LineChart>
      </ResponsiveContainer>
      <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block', textAlign: 'center' }}>
        Months
      </Typography>
    </Box>
  )
}

export default ResilienceChart

