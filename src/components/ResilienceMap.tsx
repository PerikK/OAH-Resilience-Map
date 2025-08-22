import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Header from './Header'
import CityMap from './CityMap'
import ResilienceChart from './ResilienceChart'
import CategoryChart from './CategoryChart'
import EcosystemChart from './EcosystemChart'

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(0),
  width: '100vw',
  maxWidth: '100vw',
}))

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'white',
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
}))

const FlexContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  marginTop: '16px',
})

const FlexItem = styled(Box)<{ flex?: string }>(({ flex }) => ({
  flex: flex || '1',
}))

const ResilienceMap: React.FC = () => {
  return (
    <StyledContainer>
      <Header />
      
      <Box sx={{ p: 3, width: '100%' }}>        
        <FlexContainer>
          <FlexItem flex="0 0 33%">
            <ContentBox>
              <Typography variant="h6" gutterBottom sx={{ color: '#374151', fontWeight: 600 }}>
                City Map
              </Typography>
              <CityMap />
            </ContentBox>
          </FlexItem>
          
          <FlexItem flex="0 0 67%">
            <ContentBox>
              <Typography variant="h6" gutterBottom sx={{ color: '#374151', fontWeight: 600 }}>
                Current Resilience vs Baseline/Previous Year
              </Typography>
              <ResilienceChart />
            </ContentBox>
          </FlexItem>
        </FlexContainer>

        <FlexContainer>
          <FlexItem flex="0 0 58%">
            <ContentBox>
              <Typography variant="h6" gutterBottom sx={{ color: '#374151', fontWeight: 600 }}>
                Resilience by Category
              </Typography>
              <CategoryChart />
            </ContentBox>
          </FlexItem>
          
          <FlexItem flex="0 0 42%">
            <ContentBox>
              <Typography variant="h6" gutterBottom sx={{ color: '#374151', fontWeight: 600 }}>
                Ecosystem Engagement
              </Typography>
              <EcosystemChart />
            </ContentBox>
          </FlexItem>
        </FlexContainer>
      </Box>
    </StyledContainer>
  )
}

export default ResilienceMap
