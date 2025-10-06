import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Header } from './Header'
import { CityMap } from './CityMap'
import { ResilienceChart } from './ResilienceChart'
import { CategoryChart } from './CategoryChart'
import { EcosystemChart } from './EcosystemChart'

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
  gridTemplateColumns: '66% 1px 33%',
  columnGap: '16px',
  rowGap: '16px',
  marginTop: '16px',
})

const VerticalDivider = styled(Box)({
  width: '1px',
  backgroundColor: '#e5e7eb',
})

const RightColumnStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export function ResilienceMap() {
  return (
    <StyledContainer>
      <PageFrame>
        <Header />
        <Box sx={{ p: 2, width: '100%' }}>
          <GridLayout>
            {/* Left column - Map (66% width) */}
            <ContentBox sx={{ gridColumn: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#4f46e5', fontWeight: 600 }}>
                  City Map
                </Typography>
              </Box>
              <CityMap />
            </ContentBox>

            {/* Vertical divider */}
            <VerticalDivider sx={{ gridColumn: 2 }} />

            {/* Right column - Charts stacked (33% width) */}
            <Box sx={{ gridColumn: 3 }}>
              <RightColumnStack>
                <ContentBox>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4f46e5', fontWeight: 600 }}>
                    Current Resilience vs Baseline/Previous Year
                  </Typography>
                  <ResilienceChart height={280} />
                </ContentBox>

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
              </RightColumnStack>
            </Box>
          </GridLayout>
        </Box>
      </PageFrame>
    </StyledContainer>
  )
}

