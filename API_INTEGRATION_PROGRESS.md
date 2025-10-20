# API Integration Progress

## ✅ Completed

### 1. **API Service Layer** (`src/services/`)
- ✅ `api.ts` - Base axios configuration with error handling
- ✅ `citiesService.ts` - Cities endpoints
- ✅ `sitesService.ts` - Research sites endpoints  
- ✅ `resilienceService.ts` - Health risks & urban parameters endpoints
- ✅ `index.ts` - Barrel export

### 2. **TypeScript Types** (`src/types/`)
- ✅ `api.ts` - All API response types matching Kotlin DTOs
  - `CityDTO`
  - `ResearchSiteDTO`
  - `UserSiteDTO`
  - `HealthRiskResponse`
  - `UrbanParametersResponse`
  - `ApiError`

### 3. **SelectionContext** (`src/context/SelectionContext.tsx`)
- ✅ Added API data state (cities, sites, healthRisks)
- ✅ Added loading states (isLoadingCities, isLoadingSites, isLoadingHealthRisks)
- ✅ Added error states (citiesError, sitesError, healthRisksError)
- ✅ Added data fetching on mount (useEffect hooks)
- ✅ Added helper functions:
  - `getCityById(id)` - Get city by ID
  - `getSiteByCode(code)` - Get site by code
  - `getSitesByCity(cityId)` - Get all sites for a city
  - `getHealthRiskBySiteCode(siteCode)` - Get health risk for a site

## 🔄 Data Structure Changes

### Old (Mock Data):
```typescript
// ResearchSite
{
  City: string,
  'Site Nr.': string,
  'Site Name': string,
  Latitude: number,
  Longitude: number
}

// HealthRiskData
{
  Sample: string,
  scaled_Pathogen_Risk: number,
  scaled_Fecal_Risk: number,
  scaled_ARG_Risk: number,
  health_risk_score: number
}
```

### New (API Data):
```typescript
// ResearchSiteDTO
{
  code: string,              // = 'Site Nr.'
  name: string,              // = 'Site Name'
  city: CityDTO,             // = { id, name, longitude, latitude }
  polygon: any | null,
  latitude: number,
  longitude: number,
  altitude: number | null
}

// HealthRiskResponse
{
  id: number,
  researchSiteCode: string,  // = Sample
  samplingDate: string | null,
  scaledPathogenRisk: number,  // = scaled_Pathogen_Risk
  scaledFecalRisk: number,     // = scaled_Fecal_Risk
  scaledArgRisk: number,       // = scaled_ARG_Risk
  healthRiskScore: number      // = health_risk_score
}
```

## 📋 Next Steps

### Phase 1: Update Components to Use API Data

#### High Priority:
1. **CollapsibleSidebar** - Update city/site selection dropdowns
   - Use `cities` from context instead of `getUniqueCities()`
   - Use `getSitesByCity(cityId)` instead of `getSitesByCity(cityName)`
   - Handle loading states
   - Handle errors

2. **CityMap** - Update map rendering
   - Use `sites` from context instead of `allResearchSites`
   - Use `getSiteByCode()` instead of `getSite()`
   - Use `getCityById()` for city coordinates
   - Update property names (code, name, city.latitude, etc.)

3. **MetricsCards** - Update health risk display
   - Use `getHealthRiskBySiteCode()` instead of `getHealthRiskForSite()`
   - Update property names (scaledPathogenRisk, scaledFecalRisk, etc.)

4. **EcosystemChart** - Update chart data
   - Use new health risk property names

5. **CategoryChart** - Update chart data
   - Use new health risk property names

#### Medium Priority:
6. **HealthRiskTable** - Update table data
7. **TopBar** - Add loading indicators
8. **Error handling** - Add error display components

### Phase 2: Remove Old Mock Data Files
- Delete `src/data/Research_Sites_All.json`
- Delete `src/data/score_health_risks.csv`
- Delete `src/data/researchSites.ts`
- Delete `src/data/healthRiskData.ts`

### Phase 3: Testing & Optimization
- Test all components with real API data
- Add retry logic for failed requests
- Consider adding React Query for caching (optional)
- Add loading skeletons for better UX

## 🔧 Environment Setup

**.env file:**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Backend must be running on:** `http://localhost:8080`

## 📝 Usage Example

```typescript
import { useSelection } from '../context/SelectionContext'

function MyComponent() {
  const { 
    cities, 
    sites, 
    healthRisks,
    isLoadingCities,
    citiesError,
    getCityById,
    getSitesByCity 
  } = useSelection()
  
  if (isLoadingCities) return <div>Loading...</div>
  if (citiesError) return <div>Error: {citiesError}</div>
  
  return (
    <div>
      {cities.map(city => (
        <div key={city.id}>{city.name}</div>
      ))}
    </div>
  )
}
```

## 🎯 Current Status

**Phase 1 Complete:** ✅ API Service Layer & Context Setup
**Phase 2 In Progress:** 🔄 Component Updates
**Phase 3 Pending:** ⏳ Cleanup & Testing
