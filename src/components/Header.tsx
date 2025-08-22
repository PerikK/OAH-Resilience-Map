import React, { useState } from 'react'
import { Box, Typography, TextField, MenuItem, Button, LinearProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

const HeaderContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
}))

const TopRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
})

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const Logo = styled(Box)({
  width: '20px',
  height: '20px',
  backgroundColor: '#3b82f6',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '10px',
  fontWeight: 'bold',
})

const TabsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
})

const StyledTab = styled(Button)<{ active?: boolean }>(({ active }) => ({
  padding: '6px 16px',
  borderRadius: '6px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: active ? '#f3f4f6' : 'transparent',
  color: active ? '#374151' : '#6b7280',
  border: active ? '1px solid #d1d5db' : '1px solid transparent',
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
}))

const MainContent = styled(Box)({
  display: 'flex',
  gap: '24px',
})

const LeftSidebar = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: '200px',
})

const FilterGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const MetricsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  flex: 1,
})

const MetricCard = styled(Box)<{ bgColor: string }>(({ bgColor }) => ({
  backgroundColor: bgColor,
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  textAlign: 'center',
  flex: 1,
  minHeight: '80px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const StyledLinearProgress = styled(LinearProgress)({
  height: 4,
  borderRadius: 2,
  backgroundColor: 'rgba(255,255,255,0.3)',
  margin: '8px 0 4px 0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 2,
  },
})

interface HeaderProps {
  onTabChange?: (tab: string) => void
}

const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('Overview')

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  const metrics = [
    {
      title: 'Water Resources & Quality',
      value: '29%',
      percentage: 29,
      subtitle: 'vs prev 15%',
      bgColor: '#1e40af',
    },
    {
      title: 'Biodiversity & Habitats',
      value: '29%',
      percentage: 29,
      subtitle: 'vs prev 25%',
      bgColor: '#7c3aed',
    },
    {
      title: 'Riverbank Protection',
      value: '32.5%',
      percentage: 32.5,
      subtitle: 'vs prev 29% (+10% ▼)',
      bgColor: '#0891b2',
    },
    {
      title: 'Air Quality',
      value: '10%',
      percentage: 10,
      subtitle: 'vs prev 8%',
      bgColor: '#1f2937',
    },
    {
      title: 'Sustainable Land Use & Agriculture',
      value: '62%',
      percentage: 62,
      subtitle: 'vs prev 45%',
      bgColor: '#312e81',
    },
  ]

  return (
    <HeaderContainer>
      <TopRow>
        <LogoContainer>
          <Logo>O</Logo>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '14px' }}>
            One Aqua Health
          </Typography>
          <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600, ml: 1, fontSize: '18px' }}>
            Resilience Map
          </Typography>
        </LogoContainer>

        <TabsContainer>
          <StyledTab 
            active={activeTab === 'Overview'}
            onClick={() => handleTabClick('Overview')}
          >
            Overview
          </StyledTab>
          <StyledTab 
            active={activeTab === 'Forecasting'}
            onClick={() => handleTabClick('Forecasting')}
          >
            Forecasting
          </StyledTab>
        </TabsContainer>
      </TopRow>

      <MainContent>
        <LeftSidebar>
          <FilterGroup>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '12px' }}>
              Start date
            </Typography>
            <TextField
              size="small"
              type="date"
              defaultValue="2025-01-01"
              sx={{ 
                backgroundColor: '#f9fafb',
                '& .MuiInputBase-root': { fontSize: '12px', height: '32px' }
              }}
            />
          </FilterGroup>
          
          <FilterGroup>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '12px' }}>
              End date
            </Typography>
            <TextField
              size="small"
              type="date"
              defaultValue="2025-07-31"
              sx={{ 
                backgroundColor: '#f9fafb',
                '& .MuiInputBase-root': { fontSize: '12px', height: '32px' }
              }}
            />
          </FilterGroup>
          
          <FilterGroup>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '12px' }}>
              City
            </Typography>
            <TextField
              select
              size="small"
              defaultValue="coimbra"
              sx={{ 
                backgroundColor: '#f9fafb',
                '& .MuiInputBase-root': { fontSize: '12px', height: '32px' }
              }}
            >
              <MenuItem value="coimbra">● Coimbra</MenuItem>
              <MenuItem value="lisbon">● Lisbon</MenuItem>
              <MenuItem value="porto">● Porto</MenuItem>
            </TextField>
          </FilterGroup>
          
          <FilterGroup>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '12px' }}>
              Site
            </Typography>
            <TextField
              select
              size="small"
              defaultValue="all"
              sx={{ 
                backgroundColor: '#f9fafb',
                '& .MuiInputBase-root': { fontSize: '12px', height: '32px' }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="site1">Site 1</MenuItem>
              <MenuItem value="site2">Site 2</MenuItem>
            </TextField>
          </FilterGroup>
        </LeftSidebar>

        <MetricsContainer>
          {metrics.map((metric, index) => (
            <MetricCard key={index} bgColor={metric.bgColor}>
              <Typography variant="caption" sx={{ fontSize: '11px', opacity: 0.9, mb: 0.5 }}>
                {metric.title}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                {metric.value}
              </Typography>
              <StyledLinearProgress 
                variant="determinate" 
                value={metric.percentage} 
              />
              <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.8 }}>
                {metric.subtitle}
              </Typography>
            </MetricCard>
          ))}
        </MetricsContainer>
      </MainContent>
    </HeaderContainer>
  )
}

export default Header
