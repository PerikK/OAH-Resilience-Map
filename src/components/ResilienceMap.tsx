import React from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Header from './Header.tsx'
import CityMap from './CityMap.tsx'
import ResilienceChart from './ResilienceChart.tsx'
import CategoryChart from './CategoryChart.tsx'
import EcosystemChart from './EcosystemChart.tsx'

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
  margin: 0,
  borderRadius: theme.spacing(1),
  border: '1px solid #e9d5ff',
  boxShadow: 'none',
}))

const PageFrame = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '1px solid #e9d5ff',
  backgroundColor: 'white',
}))

const GridLayout = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '25% 1px 75%',
  columnGap: '16px',
  rowGap: '16px',
  marginTop: '16px',
})

const VerticalDivider = styled(Box)({
  width: '1px',
  backgroundColor: '#e5e7eb',
})

const RightBottomGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
})

const ResilienceMap: React.FC = () => {
  return (
    <StyledContainer>
      <PageFrame>
        <Header />
        <Box sx={{ p: 2, width: '100%' }}>
          <GridLayout>
            <ContentBox sx={{ gridColumn: 1, gridRow: '1 / span 2' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4f46e5', fontWeight: 600 }}>
                City Map
              </Typography>
              <CityMap />
            </ContentBox>

            <ContentBox sx={{ gridColumn: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4f46e5', fontWeight: 600 }}>
                Current Resilience vs Baseline/Previous Year
              </Typography>
              <ResilienceChart height={280} />
            </ContentBox>

            <VerticalDivider sx={{ gridColumn: 2, gridRow: '1 / span 2' }} />

            <Box sx={{ gridColumn: 3, gridRow: 2 }}>
              <RightBottomGrid>
                <ContentBox>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4f46e5', fontWeight: 600 }}>
                    Resilience by Category
                  </Typography>
                  <CategoryChart />
                </ContentBox>
                <ContentBox>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4f46e5', fontWeight: 600 }}>
                    Ecosystem Engagement
                  </Typography>
                  <EcosystemChart />
                </ContentBox>
              </RightBottomGrid>
            </Box>
          </GridLayout>
        </Box>
      </PageFrame>
    </StyledContainer>
  )
}

export default ResilienceMap

