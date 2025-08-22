import { useMemo, useState } from 'react'
import { Box, Typography, TextField, MenuItem, Button, LinearProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSelection } from '../context/SelectionContext'
import { getMetrics, type Metric } from '../mock_data/metrics'
import type { City, Site } from '../mock_data/types'

const HeaderContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '1px solid #e9d5ff',
  boxShadow: 'none',
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
  backgroundColor: '#6366f1',
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
  backgroundColor: active ? '#ede9fe' : 'transparent',
  color: active ? '#4f46e5' : '#6b7280',
  border: active ? '1px solid #c7d2fe' : '1px solid #e5e7eb',
  '&:hover': {
    backgroundColor: active ? '#e9d5ff' : '#f9fafb',
  },
}))

const MainContent = styled(Box)({
  display: 'flex',
  gap: '24px',
})

const LeftSidebar = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '12px',
  rowGap: '12px',
  minWidth: '320px',
})

const FilterGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const MetricsContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  flex: 1,
})

const MetricCard = styled(Box)({
  backgroundColor: 'white',
  color: '#111827',
  padding: '12px',
  borderRadius: '8px',
  textAlign: 'left',
  flex: 1,
  minHeight: '110px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  border: '1px solid #e9d5ff',
})

const StyledLinearProgress = styled(LinearProgress)({
  height: 6,
  borderRadius: 3,
  backgroundColor: '#e9d5ff',
  margin: '8px 0 6px 0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#4f46e5',
    borderRadius: 3,
  },
})

export type HeaderProps = {
  onTabChange?: (tab: string) => void
}

export function Header({ onTabChange }: HeaderProps) {
  const [activeTab, setActiveTab] = useState('Overview')
  const { city, site, setCity, setSite } = useSelection()

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }
  const metrics = useMemo(() => getMetrics(city, site), [city, site])

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
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
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
              value={site}
              onChange={(e) => setSite(e.target.value as Site)}
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
          {metrics.map((metric: Metric, index: number) => (
            <MetricCard key={index}>
              <Box sx={{
                backgroundColor: metric.bgColor,
                color: 'white',
                borderRadius: '6px 6px 0 0',
                px: 1,
                py: 0.5,
                mb: 1,
              }}>
                <Typography variant="caption" sx={{ fontSize: '11px' }}>
                  {metric.title}
                </Typography>
              </Box>
              <Box sx={{ px: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px', color: '#111827' }}>
                  {metric.value}
                </Typography>
                <StyledLinearProgress 
                  variant="determinate" 
                  value={metric.percentage} 
                />
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#6b7280' }}>
                  {metric.subtitle}
                </Typography>
              </Box>
            </MetricCard>
          ))}
        </MetricsContainer>
      </MainContent>
    </HeaderContainer>
  )
}
