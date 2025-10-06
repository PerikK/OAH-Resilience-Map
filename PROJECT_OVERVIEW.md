# Resilience Map Application - Project Overview

## Application Purpose

The **Resilience Map** is a web application designed to visualize and monitor environmental resilience data for Portuguese cities and their research sites. It combines interactive mapping with real-time air quality data and resilience metrics to provide comprehensive environmental insights.

## Key Features

### 1. Interactive City & Site Selection
- **City Selection**: Users can select from multiple Portuguese cities (Coimbra, Porto, Lisbon, etc.)
- **Site Selection**: Each city has multiple research sites (e.g., Coimbra has sites C1, C2, C3)
- **Date Range Selection**: Users can specify start and end dates for data analysis
- **Pollutant Selection**: Choose from PM2.5, PM10, Ozone (O₃), or AQI (Air Quality Index)

### 2. Interactive Map with Air Quality Visualization
- **Leaflet-based Map**: Interactive map showing selected city and research sites
- **Air Quality Layer**: Displays real-time air pollution data in a circular pattern
  - **Coverage Area**: 1km radius from selected site
  - **Data Points**: Multiple sampling points (300m radius each) arranged in concentric rings
  - **Pollutant Visualization**: Color-coded circles based on pollution levels
  - **Legend**: Dynamic legend showing pollution level ranges with color coding
- **Zoom Level**: Default zoom set to 11 for optimal viewing
- **Site Markers**: Shows all research sites with detailed popups containing coordinates and site information

### 3. Resilience Data Visualization
The application displays three main chart types:
- **Current Resilience vs Baseline/Previous Year**: Time-series comparison
- **Resilience by Category**: Breakdown by environmental categories
- **Ecosystem Engagement**: Metrics showing ecosystem participation and maintenance

### 4. Real-time Air Quality Data
- **OpenWeather API Integration**: Fetches current air pollution data
- **Polar Grid Pattern**: Data points arranged in concentric rings (5 rings × 16 directions = 81 points total)
- **Multiple Pollutants**: Supports AQI, PM2.5, PM10, and O₃ measurements
- **Visual Feedback**: Color-coded circles with different colors for each pollutant type

## Technical Architecture

### Technology Stack
- **Frontend Framework**: React 19.1.1 with TypeScript
- **UI Library**: Material-UI (MUI) v7.3.1
- **Mapping**: Leaflet 1.9.4 with React-Leaflet 5.0.0
- **Charts**: Recharts 3.1.2 and MUI X-Charts 8.10.2
- **Data Processing**: xlsx 0.18.5 for Excel file parsing
- **Styling**: TailwindCSS 4.1.12 + Emotion (MUI's styling solution)
- **Build Tool**: Vite 7.1.2
- **API**: OpenWeather Air Pollution API (free tier - current data only)

### Project Structure
```
src/
├── components/
│   ├── AirQualityLayer.tsx      # Air pollution visualization layer
│   ├── CategoryChart.tsx        # Resilience category chart
│   ├── CityMap.tsx              # Main map component with pollutant selector
│   ├── EcosystemChart.tsx       # Ecosystem engagement visualization
│   ├── Header.tsx               # City/site selection and metrics display
│   ├── MetricsCards.tsx         # Metric display cards
│   ├── ResilienceChart.tsx      # Time-series resilience chart
│   └── ResilienceMap.tsx        # Main layout component
├── context/
│   └── SelectionContext.tsx     # Global state for city/site/date/pollutant selection
├── data/
│   ├── researchSites.ts         # Research site data and utilities
│   └── resilienceData.ts        # Resilience metrics and data processing
├── services/
│   └── openWeatherService.ts    # OpenWeather API integration
├── mock_data/                   # Mock data files (Excel and JSON)
└── App.tsx                      # Root application component
```

### State Management
- **SelectionContext**: Global context providing:
  - `city`: Currently selected city
  - `site`: Currently selected research site
  - `startDate`: Analysis start date (default: 2025-01-01)
  - `endDate`: Analysis end date (default: 2025-07-31)
  - `pollutant`: Selected pollutant parameter (default: 'pm2_5')

## Data Sources

### 1. Research Sites Data
- **File**: `all_sites.xlsx`
- **Structure**: Research site | Site Nr. | Site Name | Latitude | Longitude
- **Usage**: Provides coordinates and metadata for all research sites across cities

### 2. Resilience Data
- **File**: `Mock_Resilience_Dataset_2023_2025.json`
- **Metrics Tracked**:
  - Water Resources & Quality
  - Biodiversity & Habitats
  - Riverbank Protection
  - Air Quality
  - Sustainable Land Use & Agriculture
  - Waste Reduction
  - Natural Habitat
  - Climate Adaptation
  - Ecosystem Engagement (%)
  - Maintained (%)
- **Current Coverage**: Real data for Coimbra C1 site; mock data for other sites

### 3. Air Quality Data
- **Source**: OpenWeather Air Pollution API
- **API Key**: Stored in `.env` as `VITE_OPENWEATHER_API_KEY`
- **Limitation**: Free tier provides current data only (historical data requires paid subscription)
- **Coverage**: 1km radius with 81 sampling points in polar grid pattern

## Air Quality Visualization Details

### Pollutant Color Schemes

#### PM2.5 (Particulate Matter 2.5μm)
- 0-12 μg/m³: Light yellow (#FEF9C3) - Good
- 12-35 μg/m³: Yellow (#FDE047) - Moderate
- 35-55 μg/m³: Orange (#EAB308) - Unhealthy
- 55-75 μg/m³: Dark orange (#F59E0B) - Very Unhealthy
- 75+ μg/m³: Red (#DC2626) - Hazardous

#### PM10 (Particulate Matter 10μm)
- 0-20 μg/m³: Light cream (#FEF3C7) - Good
- 20-50 μg/m³: Orange (#D97706) - Moderate
- 50-100 μg/m³: Brown (#92400E) - Unhealthy
- 100-150 μg/m³: Dark brown (#78350F) - Very Unhealthy
- 150+ μg/m³: Very dark brown (#451A03) - Hazardous

#### Ozone (O₃)
- 0-50 μg/m³: Light blue (#E0F2FE) - Good
- 50-100 μg/m³: Sky blue (#7DD3FC) - Moderate
- 100-150 μg/m³: Blue (#3B82F6) - Unhealthy
- 150-200 μg/m³: Dark blue (#1E40AF) - Very Unhealthy
- 200+ μg/m³: Navy (#1E3A8A) - Hazardous

#### AQI (Air Quality Index)
- 1: Green (#00E400) - Good
- 2: Yellow (#FFFF00) - Fair
- 3: Orange (#FF7E00) - Moderate
- 4: Red (#FF0000) - Poor
- 5: Purple (#8F3F97) - Very Poor

### Sampling Pattern
- **Center Point**: 1 point at exact coordinates (1km radius circle)
- **Ring 1**: 16 points at 20% of radius (0.2km from center)
- **Ring 2**: 16 points at 40% of radius (0.4km from center)
- **Ring 3**: 16 points at 60% of radius (0.6km from center)
- **Ring 4**: 16 points at 80% of radius (0.8km from center)
- **Ring 5**: 16 points at 100% of radius (1.0km from center)
- **Directions**: 16 compass directions (N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW)
- **Total Points**: 81 sampling locations

## Environment Setup

### Required Environment Variables
Create a `.env` file in the root directory:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Current Implementation Status

### ✅ Completed Features
- Interactive map with Leaflet integration
- City and site selection system
- Date range selection
- Pollutant parameter selection (PM2.5, PM10, O₃, AQI)
- Real-time air quality data fetching from OpenWeather API
- Circular air quality visualization with 1km radius
- Individual data point circles (300m radius)
- Dynamic legend based on selected pollutant
- Color-coded pollution levels
- Resilience data visualization charts
- Responsive layout with 66/33 split (map/charts)

### 📋 Known Limitations
- **Historical Data**: OpenWeather free tier only provides current air quality data, not historical
- **Data Coverage**: Real resilience data only available for Coimbra C1 site
- **API Rate Limits**: OpenWeather free tier has request limits (60 calls/minute, 1,000,000 calls/month)

### 🎯 Configuration Settings
- **Map Zoom**: 11 (optimal for 1km radius visualization)
- **Main Circle Radius**: 1km (1,000 meters)
- **Data Point Circle Radius**: 300m (300 meters)
- **Fetch Radius**: 1km for area air pollution data
- **Default Pollutant**: PM2.5
- **Default Date Range**: 2025-01-01 to 2025-07-31

## Future Enhancements (Potential)
- Historical air quality data integration (requires paid API)
- Additional resilience data for more cities and sites
- Export functionality for reports
- Comparison tools for different time periods
- Mobile-responsive optimizations
- Additional environmental metrics
- User authentication and personalized dashboards

## Notes for Developers
- The application uses React Context for global state management
- All date inputs use ISO format (YYYY-MM-DD) internally
- The map re-renders when city or site selection changes (key prop: `${city}-${site}`)
- Air quality data fetching is triggered when coordinates or date changes
- Color schemes are defined in `AirQualityLayer.tsx` and `CityMap.tsx` (legend)
- The polar grid pattern ensures even distribution of sampling points around the selected location

---

**Last Updated**: October 7, 2025  
**Version**: 0.0.0  
**Project**: OAH Resilience Map
