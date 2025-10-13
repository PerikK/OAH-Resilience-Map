# Quick Start Guide - Weather Data Integration

## ✅ What's Done

Your Resilience Map application has been successfully updated to use **historical weather data** instead of air pollution data.

## 🎯 What Changed

### Before (Air Pollution)
- **Parameters**: PM2.5, PM10, Ozone (O₃), AQI
- **Data Source**: OpenWeather Air Pollution API (free tier)
- **Data Type**: Current air quality only
- **Component**: `AirQualityLayer.tsx`

### After (Weather Data)
- **Parameters**: Temperature, Humidity, Wind Speed, Cloudiness
- **Data Source**: OpenWeather One Call API 3.0
- **Data Type**: Historical weather from 1979 to 4 days ahead
- **Component**: `WeatherLayer.tsx`

## 🚀 How to Run

### Step 1: Get Your API Key

⚠️ **Important**: You need a paid subscription to One Call API 3.0

1. Go to: https://openweathermap.org/price
2. Subscribe to **"One Call by Call"** plan
3. Get your API key from: https://home.openweathermap.org/api_keys

### Step 2: Update Environment Variables

Create or update `.env` file in the root directory:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### Step 3: Install Dependencies (if needed)

```bash
npm install
```

### Step 4: Run the Application

```bash
npm run dev
```

### Step 5: Test the Application

1. Open the application in your browser (usually http://localhost:5173)
2. Select a city (e.g., Coimbra)
3. Select a site (e.g., C1)
4. Choose a weather parameter (Temperature, Humidity, Wind Speed, or Cloudiness)
5. The map should display colored circles showing weather data

## 🧪 Testing Without Running the App

### Option 1: HTML Test Page

1. Open `test-onecall-api.html` in your browser
2. Enter your API key
3. Click "Test API Call"
4. You should see weather data in JSON format

### Option 2: Command Line Test

```bash
npx tsx src/test-weather-service.ts
```

This will test both single point and area weather fetching.

## 📊 What You'll See

### Map Display

- **Center Marker**: Blue dot at the selected site location
- **Main Circle**: 1km radius boundary circle
- **Data Points**: 81 colored circles arranged in a polar pattern
  - 1 center point
  - 5 concentric rings
  - 16 directions per ring

### Color Coding

**Temperature** (default):
- 🔵 Blue: Cold (< 10°C)
- 🟢 Green: Cool (10-20°C)
- 🟡 Yellow: Mild (20-25°C)
- 🟠 Orange: Warm (25-30°C)
- 🔴 Red: Hot (> 30°C)

**Humidity**:
- 🟡 Yellow: Dry (< 40%)
- 🔵 Blue: Moderate (40-60%)
- 🔵 Dark Blue: Humid (> 60%)

**Wind Speed**:
- 🔵 Light Blue: Calm (< 2 m/s)
- 🟢 Green: Moderate (2-10 m/s)
- 🟢 Dark Green: Strong (> 10 m/s)

**Cloudiness**:
- ⚪ Light Gray: Clear (< 40%)
- ⚫ Gray: Cloudy (40-80%)
- ⚫ Dark Gray: Overcast (> 80%)

### Interactive Features

- **Click on circles**: View detailed weather data for that point
- **Click on site markers**: View site information
- **Change weather parameter**: Use radio buttons at the top
- **Change date**: Use date selector in the header

## 🔧 Troubleshooting

### Error: "Failed to fetch weather data"

**Possible causes:**
1. API key is missing or invalid
2. API key doesn't have One Call API 3.0 access
3. Network connection issues
4. Selected date is out of range

**Solutions:**
1. Check your `.env` file has the correct API key
2. Verify your subscription at https://home.openweathermap.org/subscriptions
3. Check your internet connection
4. Try a different date within the valid range (1979-01-01 to today + 4 days)

### Error: "401 Unauthorized"

Your API key is invalid. Double-check:
- The API key is correct in `.env`
- The environment variable name is `VITE_OPENWEATHER_API_KEY`
- You've restarted the dev server after updating `.env`

### Error: "403 Forbidden"

Your API key doesn't have One Call API 3.0 access:
- Subscribe to "One Call by Call" plan
- Wait a few minutes for the subscription to activate
- Generate a new API key if needed

### No circles appear on the map

1. Check browser console for errors (F12)
2. Verify a city and site are selected
3. Check that the date is valid
4. Try the HTML test page to verify API access

### Circles appear but are all gray

This might indicate:
- API is returning data but with unexpected values
- Check the popup data by clicking on a circle
- Verify the weather parameter is correctly selected

## 📝 Environmental Data (Unchanged)

The metrics boxes and charts still use **mock data** from:
- `src/mock_data/Mock_Resilience_Dataset_2023_2025.json`
- `src/mock_data/Research_Sites_All.json`

These will be replaced with real environmental data from a different API in the future.

## 🎨 UI Components

### Top Section (Header)
- City selector dropdown
- Site selector dropdown
- Date range pickers
- Metrics cards (using mock data)

### Left Section (Map - 66% width)
- Weather parameter selector (Temperature, Humidity, Wind Speed, Cloudiness)
- Color legend
- Interactive Leaflet map with weather visualization

### Right Section (Charts - 33% width)
- Resilience chart (using mock data)
- Category chart (using mock data)
- Ecosystem chart (using mock data)

## 📚 Additional Resources

- **Migration Guide**: See `ONECALL_API_MIGRATION.md` for detailed technical information
- **API Examples**: See `API_EXAMPLES.md` for code examples
- **Project Overview**: See `PROJECT_OVERVIEW.md` for complete documentation
- **OpenWeather Docs**: https://openweathermap.org/api/one-call-3

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Review the `MIGRATION_SUMMARY.md` file
3. Test your API key using `test-onecall-api.html`
4. Verify your subscription at OpenWeather dashboard

---

**Ready to go!** Just make sure you have a valid API key with One Call API 3.0 access, and you're all set! 🚀
