import { useMemo, useState, useEffect } from 'react'
import { Box, Typography, TextField, MenuItem, Button, LinearProgress } from '@mui/material'
import top_left_logo from '../assets/top_left_logo.svg'
import { styled } from '@mui/material/styles'
import { useSelection, type City, type Site } from '../context/SelectionContext'
import { getHealthRiskForSite } from '../data/healthRiskData'
import { getUniqueCities, getSitesByCity, type ResearchSite } from '../data/researchSites'

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

// const Logo = styled(Box)({
//   width: '20px',
//   height: '20px',
//   backgroundColor: '#6366f1',
//   borderRadius: '4px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: 'white',
//   fontSize: '10px',
//   fontWeight: 'bold',
// })

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
  const [cities, setCities] = useState<string[]>([])
  const [availableSites, setAvailableSites] = useState<ResearchSite[]>([])
  const { city, site, startDate, endDate, setCity, setSite, setStartDate, setEndDate } = useSelection()

  useEffect(() => {
    // Load unique cities on component mount
    const uniqueCities = getUniqueCities()
    setCities(uniqueCities)
  }, [])

  useEffect(() => {
    // Load sites for selected city
    if (city) {
      const sites = getSitesByCity(city)
      setAvailableSites(sites)
    }
  }, [city])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }
  
  const metrics = useMemo(() => {
    // Return placeholder cards if no city is selected
    if (!city) {
      return [
        {
          title: 'Water Quality',
          value: 'Please select a city to view Water Quality data',
          percentage: 0,
          subtitle: 'Water Resources & Quality',
          bgColor: '#6b7280',
          color: '#6b7280',
          isEmpty: true
        },
        {
          title: 'Biodiversity',
          value: 'Please select a city to view Biodiversity data',
          percentage: 0,
          subtitle: 'Biodiversity & Habitats',
          bgColor: '#6b7280',
          color: '#6b7280',
          isEmpty: true
        },
        {
          title: 'Air Quality',
          value: 'Please select a city to view Air Quality data',
          percentage: 0,
        }
      ]
    }
    
    if (!site || site === 'all') {
      return [
        {
          title: 'Select a site',
          value: '--',
          percentage: 0,
          subtitle: 'No data available',
          bgColor: '#e5e7eb',
          color: '#6b7280',
          isEmpty: true
        }
      ]
    }
    
    const healthData = site ? getHealthRiskForSite(site) : null
    if (!healthData) {
      return [
        {
          title: 'No data',
          value: '--',
          percentage: 0,
          subtitle: 'Site not found',
          bgColor: '#e5e7eb',
          color: '#6b7280',
          isEmpty: true
        }
      ]
    }
    
    return [
      {
        title: 'Pathogen Risk',
        value: `${(healthData.scaled_Pathogen_Risk * 100).toFixed(1)}%`,
        percentage: healthData.scaled_Pathogen_Risk * 100,
        subtitle: 'Scaled Risk Score',
        bgColor: '#DC2626',
        color: '#DC2626'
      },
      {
        title: 'Fecal Risk',
        value: `${(healthData.scaled_Fecal_Risk * 100).toFixed(1)}%`,
        percentage: healthData.scaled_Fecal_Risk * 100,
        subtitle: 'Scaled Risk Score',
        bgColor: '#EA580C',
        color: '#EA580C'
      },
      {
        title: 'ARG Risk',
        value: `${(healthData.scaled_ARG_Risk * 100).toFixed(1)}%`,
        percentage: healthData.scaled_ARG_Risk * 100,
        subtitle: 'Scaled Risk Score',
        bgColor: '#D97706',
        color: '#D97706'
      },
      {
        title: 'Overall Risk',
        value: `${(healthData.health_risk_score * 100).toFixed(1)}%`,
        percentage: healthData.health_risk_score * 100,
        subtitle: 'Combined Score',
        bgColor: '#7C3AED',
        color: '#7C3AED'
      }
    ]
  }, [city, site])

  return (
    <HeaderContainer>
      <TopRow>
        <LogoContainer>
          <img 
            src={top_left_logo} 
            alt="Logo" 
            style={{ 
              width: '320px', 
              height: '120px',
              objectFit: 'contain'
            }} 
          />
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              inputProps={{
                min: '1979-01-01',
                max: endDate
              }}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              inputProps={{
                min: startDate || '1979-01-01',
                max: new Date().toISOString().split('T')[0]
              }}
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
              value={city || ''}
              onChange={(e) => setCity(e.target.value === '' ? null : e.target.value as City)}
              sx={{ 
                backgroundColor: '#f9fafb',
                '& .MuiInputBase-root': { fontSize: '12px', height: '32px' }
              }}
            >
              <MenuItem value="" disabled>
                Please select a city
              </MenuItem>
              {cities.map((cityName) => (
                <MenuItem key={cityName} value={cityName}>
                  ● {cityName}
                </MenuItem>
              ))}
            </TextField>
          </FilterGroup>
          
          <FilterGroup>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '12px' }}>
              Site
            </Typography>
            <TextField
              select
              size="small"
              value={site || ''}
              onChange={(e) => setSite(e.target.value === '' ? null : e.target.value as Site)}
              disabled={!city}
              sx={{ 
                backgroundColor: city ? '#f9fafb' : '#f3f4f6',
                '& .MuiInputBase-root': { fontSize: '12px', height: '32px' }
              }}
            >
              <MenuItem value="" disabled>
                {city ? 'Please select a site' : 'Select a city first'}
              </MenuItem>
              {city && (
                <MenuItem value="all">All Sites</MenuItem>
              )}
              {availableSites.map((siteData) => (
                <MenuItem key={siteData['Site Nr.']} value={siteData['Site Nr.']}>
                  {siteData['Site Nr.']} - {siteData['Site Name']}
                </MenuItem>
              ))}
            </TextField>
          </FilterGroup>
        </LeftSidebar>

        <MetricsContainer>
          {metrics.map((metric, index: number) => (
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
                <Typography 
                  variant={'isEmpty' in metric && metric.isEmpty ? "body2" : "h6"} 
                  sx={{ 
                    fontWeight: ('isEmpty' in metric && metric.isEmpty) ? 'normal' : 'bold', 
                    fontSize: ('isEmpty' in metric && metric.isEmpty) ? '12px' : '18px', 
                    color: ('isEmpty' in metric && metric.isEmpty) ? '#6b7280' : '#111827',
                    textAlign: ('isEmpty' in metric && metric.isEmpty) ? 'center' : 'left',
                    lineHeight: ('isEmpty' in metric && metric.isEmpty) ? 1.3 : 1.2
                  }}
                >
                  {metric.value}
                </Typography>
                {!('isEmpty' in metric && metric.isEmpty) && (
                  <StyledLinearProgress 
                    variant="determinate" 
                    value={metric.percentage} 
                  />
                )}
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
