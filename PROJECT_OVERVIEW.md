# Resilience Map Application - Project Overview

## Application Purpose

The **Resilience Map** is a web application designed to visualize and monitor environmental health risk and weather data for Portuguese cities and their research sites. It combines interactive mapping with historical weather data and health risk metrics to provide comprehensive environmental insights.

## Key Features

### 1. Interactive City & Site Selection

- **City Selection**: Users can select from multiple Portuguese cities (Coimbra, Porto, Lisbon, etc.)
- **Site Selection**: Each city has multiple research sites (e.g., Coimbra has sites C1, C2, C3)
- **Date Range Selection**: Users can specify a date range for weather data analysis (currently only start date is used)
- **Collapsible Sidebar**: Right-side panel with three sections:
  - Site/City/Date selection
  - Health Risk Data checkboxes (Pathogen Risk, Fecal Contamination Risk, ARG Risk, Overall Health Risk Score)
  - Weather Data checkboxes (Wind Speed & Direction, Rainfall, Humidity) with color-coded legends
- **Dark/Light Theme Toggle**: Application-wide theme switcher in the top bar

### 2. Interactive Map with Historical Weather Visualization

- **Leaflet-based Map**: Interactive map showing selected city and research sites
- **Map Type Toggle**: Switch between Street and Satellite views
- **Weather Layer**: Displays historical weather data using Open-Meteo API (free) in a circular pattern
  - **Coverage Area**: 1km radius from selected site
  - **Wind Direction Arrows**: Visual indicators showing wind direction and strength
  - **Weather Visualization**: Color-coded circles based on weather conditions
- **Zoom Level**: Default zoom to Europe, auto-centers on selected city (zoom 4)
- **City Circles**: Large green circles (35km radius) representing cities, clickable to select
- **Site Markers**: Custom health risk icons showing risk levels with detailed popups
- **Health Risk Icons**: Color-coded markers (green=low, yellow=moderate, orange=high, red=very high)

### 3. Health Risk & Weather Data Tables

The application displays data in two responsive tables below the map:

- **Health Risk Data Table**: Shows selected health risk metrics for the chosen site
  - Pathogen Risk, Fecal Contamination Risk, ARG Risk, Overall Health Risk Score
  - Color-coded risk levels (Low, Moderate, High, Very High)
  - Visual risk indicators (triangles for high risk, circles for low risk)
- **Weather Data Table**: Shows weather metrics for the selected date and site
  - Wind Speed & Direction, Rainfall, Humidity
  - Fetched from Open-Meteo Historical Weather API
  - Daily averages calculated from hourly data

### 4. Historical Weather Data

- **Open-Meteo API Integration**: Free API for historical weather data (no API key required)
- **Coverage**: Historical data from 1940 onwards
- **Parameters**: Temperature, Humidity, Wind Speed & Direction, Rainfall, Cloud Cover, Pressure
- **Visual Feedback**: Color-coded circles and wind direction arrows
- **Real-time Fetching**: Data fetched on-demand when site and date are selected

## Technical Architecture

### Technology Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **UI Library**: Material-UI (MUI) v7.3.1
- **Mapping**: Leaflet 1.9.4 with React-Leaflet 5.0.0
- **Data Processing**: xlsx 0.18.5 for Excel file parsing
- **Styling**: TailwindCSS 4.1.12 + Emotion (MUI's styling solution)
- **Build Tool**: Vite 7.1.2
- **API**: Open-Meteo Historical Weather API (FREE - no API key required)

### Project Structure

```bash
src/
├── components/
│   ├── CityMap.tsx              # Main map component with city/site markers
│   ├── CollapsibleSidebar.tsx   # Right sidebar with selections and legends
│   ├── HealthRiskTable.tsx      # Health risk data table
│   ├── ResilienceMap.tsx        # Main layout component
│   ├── TopBar.tsx               # Top navigation with theme toggle
│   ├── WeatherDataTable.tsx     # Weather data table
│   ├── WeatherLayer.tsx         # Weather visualization layer (1km radius)
│   └── AirQualityLayer.tsx      # Air quality visualization (if implemented)
├── context/
│   ├── SelectionContext.tsx     # Global state for city/site/date/metrics selection
│   └── ThemeContext.tsx         # Dark/Light theme management
├── data/
│   ├── researchSites.ts         # Research site data and utilities
│   ├── healthRiskData.ts        # Health risk metrics
│   └── score_health_risks.csv   # Health risk scores data
├── services/
│   └── openMeteoService.ts      # Open-Meteo API integration
├── public/
│   └── all_sites.xlsx           # Research sites Excel file
└── App.tsx                      # Root application component
```

### State Management

- **SelectionContext**: Global context providing:
  - `city`: Currently selected city
  - `site`: Currently selected research site
  - `startDate`: Analysis start date (default: 2025-01-01)
  - `endDate`: Analysis end date (default: 2025-07-31) - currently not used
  - `selectedHealthRisks`: Array of selected health risk metrics
  - `selectedWeatherMetrics`: Array of selected weather metrics
  - Helper functions: `toggleHealthRisk()`, `toggleWeatherMetric()`
- **ThemeContext**: Theme management providing:
  - `mode`: Current theme mode ('light' or 'dark')
  - `toggleTheme()`: Function to switch between themes
  - `theme`: MUI theme object with custom palette

## Data Sources

### 1. Research Sites Data

- **File**: `all_sites.xlsx`
- **Structure**: Research site | Site Nr. | Site Name | Latitude | Longitude
- **Usage**: Provides coordinates and metadata for all research sites across cities

### 2. Health Risk Data

- **File**: `score_health_risks.csv`
- **Metrics Tracked**:
  - Pathogen Risk (pathogen_risk)
  - Fecal Contamination Risk (fecal_contamination_risk)
  - ARG Risk (arg_risk)
  - Overall Health Risk Score (health_risk_score)
- **Current Coverage**: Real data for Coimbra sites (C1, C2, C3); mock/random data for other cities
- **Risk Levels**: Low (<0.25), Moderate (0.25-0.5), High (0.5-0.75), Very High (>0.75)

### 3. Weather Data

- **Source**: Open-Meteo Historical Weather API (archive-api.open-meteo.com)
- **API Key**: Not required - completely free
- **Coverage**: 1km radius from selected site
- **Historical Range**: 1940 to present
- **Parameters Available**:
  - Temperature (°C)
  - Relative Humidity (%)
  - Wind Speed (m/s) and Direction (degrees)
  - Precipitation/Rainfall (mm)
  - Cloud Cover (%)
  - Pressure (hPa)
  - Weather Code (WMO codes)

## Visualization Details

### Health Risk Color Schemes

- **Low Risk** (< 0.25): Green (#10B981) with circle indicator
- **Moderate Risk** (0.25-0.5): Yellow (#FDE047) with dash indicator
- **High Risk** (0.5-0.75): Orange (#F59E0B) with dash indicator
- **Very High Risk** (> 0.75): Red (#DC2626) with upward triangle indicator

### Weather Visualization

#### Wind Speed & Direction Legend

- 0-2 m/s: Light blue (#E0F2FE) - Calm
- 2-5 m/s: Light green (#86EFAC) - Light Breeze
- 5-10 m/s: Green (#22C55E) - Moderate
- 10-15 m/s: Dark green (#15803D) - Strong
- 15+ m/s: Very dark green (#14532D) - Very Strong
- **Wind Arrows**: Blue arrows showing direction when speed ≥ 0.5 m/s
- **Calm Indicators**: Gray dots when speed < 0.5 m/s

#### Rainfall Legend

- 0 mm: Light gray (#F3F4F6)
- 0-2 mm: Light blue (#BAE6FD)
- 2-5 mm: Sky blue (#7DD3FC)
- 5-10 mm: Blue (#0EA5E9)
- 10+ mm: Dark blue (#0369A1)

#### Humidity Legend

- 0-20%: Light yellow (#FEF3C7)
- 20-40%: Light blue (#7DD3FC)
- 40-60%: Blue (#3B82F6)
- 60-80%: Dark blue (#1E40AF)
- 80-100%: Navy (#1E3A8A)

### Weather Layer Pattern

- **Single Circle**: 1km radius from selected site
- **Wind Arrows**: Multiple arrows showing wind direction (number based on wind speed)
- **Popup Data**: Shows all weather parameters for the selected date at noon (12:00)

## Environment Setup

### No Environment Variables Required

The application uses the free Open-Meteo API which does not require an API key.

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
- City and site selection system via collapsible sidebar
- Date range selection (start date currently used, end date reserved for future)
- Dark/Light theme toggle with full application support
- Historical weather data fetching from Open-Meteo API (free)
- Weather visualization with 1km radius circle
- Wind direction arrows and calm indicators
- Health risk data tables with color-coded risk levels
- Weather data tables with daily averages
- Dynamic legends for weather metrics
- Responsive layout with map on top, tables below
- Tooltips on disabled checkboxes
- Theme-aware UI components (dropdowns, tables, sidebar)

### 📋 Known Limitations & Notes

- **Date Range**: End date is selected but currently not used (only start date fetches weather data)
- **Data Coverage**: Real health risk data only available for Coimbra sites (C1, C2, C3)
- **Weather Data**: Single-day data only (no multi-day aggregation yet)
- **Checkboxes**: Health Risk and Weather Data checkboxes are disabled until both city and site are selected
- **API**: Free Open-Meteo API with no rate limits for reasonable use

### 🎯 Configuration Settings

- **Map Initial Zoom**: 4 (Europe view), auto-centers on selected city
- **Weather Circle Radius**: 1km (1,000 meters)
- **City Circle Radius**: 35km (35,000 meters)
- **Default Date Range**: 2025-01-01 to 2025-07-31
- **Default Theme**: Light mode
- **Sidebar Width**: 400px (fixed)
- **Map Height**: 50vh when data shown, 80vh when no data

## Future Enhancements (Potential)

- **Date Range Aggregation**: Use end date to aggregate weather data over multiple days
- **Additional Cities**: Expand health risk data coverage beyond Coimbra
- **Charts/Graphs**: Add time-series charts for weather trends
- **Export Functionality**: Export data tables to CSV/Excel
- **Comparison Tools**: Compare different sites or time periods
- **Mobile Optimization**: Responsive design for mobile devices
- **Air Quality Layer**: Integrate air quality data visualization
- **User Preferences**: Save user's selected metrics and theme
- **Multi-day Weather**: Show weather trends over the selected date range

## Notes for Developers

- The application uses React Context for global state management (SelectionContext, ThemeContext)
- All date inputs use ISO format (YYYY-MM-DD) internally
- The map re-renders when city or site selection changes
- Weather data fetching is triggered when site and date change
- Color schemes are defined in `CollapsibleSidebar.tsx` (legends) and table components
- Health risk data is loaded from CSV file and parsed on app load
- Weather data uses Open-Meteo Archive API (free, no authentication)
- Theme colors use MUI's theme palette tokens for automatic dark/light mode support
- TypeScript types are defined in `src/mock_data/types.ts`
- Calendar icon styling uses CSS filter to improve visibility in light mode

---

**Last Updated**: October 13, 2025  
**Version**: 1.0.0  
**Project**: OAH Resilience Map
