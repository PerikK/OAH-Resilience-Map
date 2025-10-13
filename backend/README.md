# Resilience Map Backend API

Backend service for fetching air quality data from ECMWF Copernicus Atmosphere Data Store (ADS).

## Prerequisites

1. **Node.js** (v18 or higher)
2. **ECMWF ADS Account** - Register at https://ads.atmosphere.copernicus.eu/

## Setup Instructions

### 1. Get ECMWF API Credentials

1. Go to https://ads.atmosphere.copernicus.eu/
2. Register for a free account
3. Go to your profile: https://ads.atmosphere.copernicus.eu/user
4. Copy your **UID** (this is your email) and **API Key**

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
# ADS_API_EMAIL=your_email@example.com
# ADS_API_KEY=your_api_key_here
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on http://localhost:4000

### 5. Test the API

**Health check:**
```bash
curl http://localhost:4000/api/health
```

**Get available variables:**
```bash
curl http://localhost:4000/api/variables
```

**Fetch air quality data:**
```bash
curl -X POST http://localhost:4000/api/airquality \
  -H "Content-Type: application/json" \
  -d '{
    "variable": ["carbon_monoxide"],
    "start_date": "2024-01-01",
    "end_date": "2024-01-07",
    "area": [41, -9, 40, -8]
  }'
```

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Resilience Map Backend API is running",
  "timestamp": "2025-10-08T09:35:00.000Z"
}
```

### GET /api/variables
Get list of available air quality variables.

**Response:**
```json
{
  "available_variables": [
    "carbon_monoxide",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
    "particulate_matter_10um",
    "particulate_matter_2.5um"
  ]
}
```

### POST /api/airquality
Fetch air quality data from ECMWF.

**Request Body:**
```json
{
  "variable": ["carbon_monoxide", "nitrogen_dioxide"],
  "start_date": "2024-01-01",
  "end_date": "2024-01-07",
  "area": [41, -9, 40, -8]
}
```

**Parameters:**
- `variable` (array): List of variables to fetch
- `start_date` (string): Start date in YYYY-MM-DD format
- `end_date` (string): End date in YYYY-MM-DD format
- `area` (array): Bounding box [North, West, South, East] in degrees

**Response:**
NetCDF file (binary data)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ADS_API_EMAIL` | Your ECMWF ADS email/UID | Yes | - |
| `ADS_API_KEY` | Your ECMWF ADS API key | Yes | - |
| `PORT` | Server port | No | 4000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:5173 |

## ECMWF CAMS Variables

Common air quality variables available:
- `carbon_monoxide` - CO concentration
- `nitrogen_dioxide` - NO₂ concentration
- `sulphur_dioxide` - SO₂ concentration
- `ozone` - O₃ concentration
- `particulate_matter_10um` - PM10
- `particulate_matter_2.5um` - PM2.5
- `dust_aerosol_optical_depth_550nm` - Dust AOD
- `total_aerosol_optical_depth_550nm` - Total AOD

See full list: https://ads.atmosphere.copernicus.eu/cdsapp#!/dataset/cams-global-reanalysis-eac4

## Troubleshooting

### "Missing ADS API credentials"
Make sure your `.env` file exists and contains valid credentials.

### "No response from ECMWF API"
- Check your internet connection
- Verify your API credentials are correct
- ECMWF service may be temporarily down

### CORS errors
Make sure `FRONTEND_URL` in `.env` matches your React app URL (default: http://localhost:5173)

## Notes

- ECMWF API requests can take time (30-60 seconds) for large datasets
- NetCDF files need to be parsed on the frontend (use libraries like `netcdfjs`)
- Consider caching responses for frequently requested data
- Rate limits may apply depending on your ECMWF account type

## Next Steps

1. Add NetCDF parsing on the frontend
2. Implement caching layer (Redis/file-based)
3. Add data aggregation endpoints
4. Add authentication for production use
