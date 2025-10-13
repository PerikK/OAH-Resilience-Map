/**
 * Test script for the refactored OpenWeather service using One Call API 3.0
 * 
 * To run this test:
 * 1. Make sure your VITE_OPENWEATHER_API_KEY is set in .env file
 * 2. Run: npx tsx src/test-weather-service.ts
 * 
 * Or you can import and call these functions from your React components
 */

import { 
  fetchHistoricalWeather, 
  fetchAreaHistoricalWeather,
  type OneCallTimemachineResponse,
  type AreaWeatherPoint
} from './services/openWeatherService'

// Test coordinates (Coimbra, Portugal)
const TEST_LAT = 40.19787
const TEST_LON = -8.42865
const TEST_DATE = '2024-01-15' // Or use a Unix timestamp

async function testSinglePoint() {
  console.log('\n🧪 Testing single point historical weather fetch...')
  console.log(`Location: ${TEST_LAT}, ${TEST_LON}`)
  console.log(`Date: ${TEST_DATE}`)
  
  try {
    const result = await fetchHistoricalWeather(TEST_LAT, TEST_LON, TEST_DATE)
    
    if (result) {
      console.log('✅ Success!')
      console.log('\nResponse summary:')
      console.log(`- Timezone: ${result.timezone}`)
      console.log(`- Data points: ${result.data.length}`)
      
      if (result.data.length > 0) {
        const weather = result.data[0]
        console.log('\nWeather data:')
        console.log(`- Temperature: ${weather.temp}°C`)
        console.log(`- Feels like: ${weather.feels_like}°C`)
        console.log(`- Humidity: ${weather.humidity}%`)
        console.log(`- Wind speed: ${weather.wind_speed} m/s`)
        console.log(`- Clouds: ${weather.clouds}%`)
        console.log(`- Pressure: ${weather.pressure} hPa`)
        console.log(`- Visibility: ${weather.visibility} m`)
        
        if (weather.weather && weather.weather.length > 0) {
          console.log(`- Condition: ${weather.weather[0].main} - ${weather.weather[0].description}`)
        }
      }
      
      console.log('\nFull response:')
      console.log(JSON.stringify(result, null, 2))
    } else {
      console.log('❌ No data returned')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

async function testAreaWeather() {
  console.log('\n🧪 Testing area historical weather fetch...')
  console.log(`Center: ${TEST_LAT}, ${TEST_LON}`)
  console.log(`Date: ${TEST_DATE}`)
  console.log(`Radius: 1 km`)
  
  try {
    const results = await fetchAreaHistoricalWeather(TEST_LAT, TEST_LON, TEST_DATE, 1)
    
    if (results && results.length > 0) {
      console.log(`✅ Success! Fetched ${results.length} data points`)
      
      // Calculate average temperature
      const avgTemp = results.reduce((sum, point) => 
        sum + point.weatherData.data[0].temp, 0) / results.length
      
      console.log(`\nAverage temperature: ${avgTemp.toFixed(2)}°C`)
      
      // Show first few points
      console.log('\nFirst 3 data points:')
      results.slice(0, 3).forEach((point, idx) => {
        const weather = point.weatherData.data[0]
        console.log(`\n${idx + 1}. Point ${point.id}:`)
        console.log(`   Location: ${point.lat.toFixed(4)}, ${point.lon.toFixed(4)}`)
        console.log(`   Distance: ${point.distance.toFixed(2)} km`)
        console.log(`   Angle: ${point.angle !== null ? point.angle + '°' : 'center'}`)
        console.log(`   Temperature: ${weather.temp}°C`)
        console.log(`   Humidity: ${weather.humidity}%`)
      })
    } else {
      console.log('❌ No data returned')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

async function runTests() {
  console.log('🌤️  One Call API 3.0 Timemachine Test Suite')
  console.log('=' .repeat(50))
  
  // Test 1: Single point
  await testSinglePoint()
  
  // Wait a bit to avoid rate limiting
  console.log('\n⏳ Waiting 2 seconds before next test...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Test 2: Area weather
  await testAreaWeather()
  
  console.log('\n' + '='.repeat(50))
  console.log('✨ Tests completed!')
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}

export { testSinglePoint, testAreaWeather, runTests }
