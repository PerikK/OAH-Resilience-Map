# Resilience Map Application - Project Overview

## Application Purpose

The **Resilience Map** is a web application designed to visualize and monitor environmental resilience data for Portuguese cities and their research sites. It combines interactive mapping with real-time air quality data and resilience metrics to provide comprehensive environmental insights.

## Key Features

### 1. Interactive City & Site Selection

- **City Selection**: Users can select from multiple Portuguese cities (Coimbra, Porto, Lisbon, etc.)
- **Site Selection**: Each city has multiple research sites (e.g., Coimbra has sites C1, C2, C3)
- **Date Range Selection**: Users can specify start and end dates for data analysis
- **Weather Parameter Selection**: Choose from Temperature, Humidity, Wind Speed, or Cloudiness

### 2. Interactive Map with Historical Weather Visualization

- **Leaflet-based Map**: Interactive map showing selected city and research sites
- **Weather Layer**: Displays historical weather data using One Call API 3.0 in a circular pattern
  - **Coverage Area**: 1km radius from selected site
  - **Data Points**: Multiple sampling points (300m radius each) arranged in concentric rings
  - **Weather Visualization**: Color-coded circles based on selected weather parameter
  - **Legend**: Dynamic legend showing weather parameter ranges with color coding
- **Zoom Level**: Default zoom set to 11 for optimal viewing
- **Site Markers**: Shows all research sites with detailed popups containing coordinates and site information

### 3. Resilience Data Visualization

The application displays three main chart types:

- **Current Resilience vs Baseline/Previous Year**: Time-series comparison
- **Resilience by Category**: Breakdown by environmental categories
- **Ecosystem Engagement**: Metrics showing ecosystem participation and maintenance

### 4. Historical Weather Data

- **OpenWeather One Call API 3.0 Integration**: Fetches historical weather data for any date
- **Polar Grid Pattern**: Data points arranged in concentric rings (5 rings × 16 directions = 81 points total)
- **Multiple Parameters**: Supports Temperature, Humidity, Wind Speed, and Cloudiness measurements
- **Visual Feedback**: Color-coded circles with different colors for each weather parameter
- **Date Range**: Access to historical data from January 1, 1979 to 4 days ahead

## Technical Architecture

### Technology Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **UI Library**: Material-UI (MUI) v7.3.1
- **Mapping**: Leaflet 1.9.4 with React-Leaflet 5.0.0
- **Charts**: Recharts 3.1.2 and MUI X-Charts 8.10.2
- **Data Processing**: xlsx 0.18.5 for Excel file parsing
- **Styling**: TailwindCSS 4.1.12 + Emotion (MUI's styling solution)
- **Build Tool**: Vite 7.1.2
- **API**: OpenWeather One Call API 3.0 (requires paid subscription - historical weather data)

### Project Structure

```bash
src/
├── components/
│   ├── WeatherLayer.tsx         # Historical weather visualization layer
│   ├── CategoryChart.tsx        # Resilience category chart
│   ├── CityMap.tsx              # Main map component with weather parameter selector
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
  - `weatherParam`: Selected weather parameter (default: 'temp')

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

### 3. Weather Data

- **Source**: OpenWeather One Call API 3.0 (timemachine endpoint)
- **API Key**: Stored in `.env` as `VITE_OPENWEATHER_API_KEY`
- **Requirement**: Requires paid "One Call by Call" subscription
- **Coverage**: 1km radius with 81 sampling points in polar grid pattern
- **Historical Range**: January 1, 1979 to 4 days ahead

## Weather Visualization Details

### Weather Parameter Color Schemes

#### Temperature

- < 0°C: Navy (#1E3A8A) - Very Cold
- 0-10°C: Blue (#3B82F6) - Cold
- 10-20°C: Green (#10B981) - Cool
- 20-25°C: Yellow (#FDE047) - Mild
- 25-30°C: Orange (#F59E0B) - Warm
- 30-35°C: Red (#EF4444) - Hot
- > 35°C: Dark Red (#DC2626) - Very Hot

#### Humidity

- 0-20%: Light cream (#FEF3C7) - Very Dry
- 20-40%: Sky blue (#7DD3FC) - Dry
- 40-60%: Blue (#3B82F6) - Moderate
- 60-80%: Dark blue (#1E40AF) - Humid
- 80-100%: Navy (#1E3A8A) - Very Humid

#### Wind Speed

- 0-2 m/s: Light blue (#E0F2FE) - Calm
- 2-5 m/s: Light green (#86EFAC) - Light Breeze
- 5-10 m/s: Green (#22C55E) - Moderate
- 10-15 m/s: Dark green (#15803D) - Strong
- > 15 m/s: Very dark green (#14532D) - Very Strong

#### Cloudiness

- 0-20%: Light gray (#F3F4F6) - Clear
- 20-40%: Gray (#D1D5DB) - Partly Cloudy
- 40-60%: Medium gray (#9CA3AF) - Mostly Cloudy
- 60-80%: Dark gray (#6B7280) - Cloudy
- 80-100%: Very dark gray (#374151) - Overcast

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

```js
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
- Weather parameter selection (Temperature, Humidity, Wind Speed, Cloudiness)
- Historical weather data fetching from OpenWeather One Call API 3.0
- Circular weather visualization with 1km radius
- Individual data point circles (300m radius)
- Dynamic legend based on selected weather parameter
- Color-coded weather levels
- Resilience data visualization charts (from mock data)
- Responsive layout with 66/33 split (map/charts)

### 📋 Known Limitations

- **API Subscription**: One Call API 3.0 requires a paid subscription ("One Call by Call" plan)
- **Data Coverage**: Real resilience data only available for Coimbra C1 site (environmental metrics use mock data)
- **API Rate Limits**: Be mindful of rate limits when fetching data for multiple points (81 points per request)

### 🎯 Configuration Settings

- **Map Zoom**: 11 (optimal for 1km radius visualization)
- **Main Circle Radius**: 1km (1,000 meters)
- **Data Point Circle Radius**: 300m (300 meters)
- **Fetch Radius**: 1km for area air pollution data
- **Default Weather Parameter**: Temperature
- **Default Date Range**: 2025-01-01 to 2025-07-31

## Future Enhancements (Potential)

- Integration with dedicated environmental data API for real pollution/air quality metrics
- Additional resilience data for more cities and sites
- Export functionality for reports
- Comparison tools for different time periods
- Mobile-responsive optimizations
- Additional environmental metrics from external sources
- User authentication and personalized dashboards
- Weather forecast visualization (One Call API 3.0 supports up to 4 days ahead)

## Notes for Developers

- The application uses React Context for global state management
- All date inputs use ISO format (YYYY-MM-DD) internally
- The map re-renders when city or site selection changes (key prop: `${city}-${site}`)
- Weather data fetching is triggered when coordinates or date changes
- Color schemes are defined in `WeatherLayer.tsx` and `CityMap.tsx` (legend)
- The polar grid pattern ensures even distribution of sampling points around the selected location
- Environmental/resilience metrics are loaded from mock data in `src/mock_data/`
- Weather data uses One Call API 3.0 timemachine endpoint for historical accuracy

---

**Last Updated**: October 7, 2025  
**Version**: 0.0.0  
**Project**: OAH Resilience Map
