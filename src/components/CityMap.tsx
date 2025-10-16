import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useSelection, type City, type Site } from "../context/SelectionContext";
import {
  getCityCoordinates,
  getSitesByCity,
  getSite,
  getUniqueCities,
  type ResearchSite,
} from "../data/researchSites";
import { getHealthRiskForSite } from "../data/healthRiskData";
import { getLatestResilienceData } from "../data/resilienceData";
import { WeatherInfoBox } from "./WeatherInfoBox";
import { MetricsCards } from "./MetricsCards";
import { EcosystemChart } from "./EcosystemChart";
import { CategoryChart } from "./CategoryChart";
import "leaflet/dist/leaflet.css";

const StyledMapContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "8px",
  overflow: "visible", // Changed from hidden to allow charts overlay
  "& .leaflet-container": {
    height: "100%",
    width: "100%",
    borderRadius: "8px",
  },
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
});

// Fix Leaflet default markers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map repositioning when charts are shown
function MapPositionController({ 
  siteCoords, 
  showCharts 
}: { 
  siteCoords: { lat: number; lon: number } | null; 
  showCharts: boolean 
}) {
  const map = useMap();

  useEffect(() => {
    if (siteCoords && showCharts) {
      // Pan the map to position the site in the top-left area
      // We need to move the map so the site appears in the top-left
      const point = map.latLngToContainerPoint([siteCoords.lat, siteCoords.lon]);
      // Calculate target position: 25% from left, 25% from top of visible area
      const targetX = map.getSize().x * 0.25;
      const targetY = map.getSize().y * 0.25;
      // Calculate the offset needed
      const offsetX = point.x - targetX;
      const offsetY = point.y - targetY;
      // Apply the offset to move the map
      const newPoint = L.point(point.x + offsetX, point.y + offsetY);
      const newLatLng = map.containerPointToLatLng(newPoint);
      map.panTo(newLatLng, { animate: true, duration: 0.5 });
    }
  }, [map, siteCoords, showCharts]);

  return null;
}

// Component to show site circle with comprehensive popup
interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
}

function SiteCircleWithPopup({ lat, lon, city, site, startDate }: { lat: number; lon: number; city: string; site: string; startDate: string }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const { fetchAreaHistoricalWeather, getHourlyValue } = await import('../services/openMeteoService');
        const data = await fetchAreaHistoricalWeather(lat, lon, startDate, 1);
        
        if (data && data.length > 0) {
          const hourly = data[0].weatherData.hourly;
          const hourIndex = 12; // Noon data
          
          setWeatherData({
            temperature: getHourlyValue(hourly.temperature_2m, hourIndex) || 0,
            humidity: getHourlyValue(hourly.relative_humidity_2m, hourIndex) || 0,
            windSpeed: getHourlyValue(hourly.wind_speed_10m, hourIndex) || 0,
            windDirection: getHourlyValue(hourly.wind_direction_10m, hourIndex) || 0,
            precipitation: hourly.precipitation?.reduce((acc: number, val: number) => acc + val, 0) || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (startDate) {
      fetchWeather();
    }
  }, [lat, lon, startDate]);

  const siteData = getSite(city, site);
  const healthData = getHealthRiskForSite(site);
  const resilienceData = getLatestResilienceData(site);

  return (
    <Circle
      center={[lat, lon]}
      radius={1000}
      pathOptions={{
        color: '#707070',
        fillColor: '#FFFBEB',
        fillOpacity: 0.8,
        weight: 1,
        dashArray: '5, 5',
      }}
    >
      <Popup maxWidth={600} minWidth={500}>
        <Box sx={{ p: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '16px' }}>
            {siteData?.['Site Nr.']} - {siteData?.['Site Name']}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '12px' }}>
            {city} • Lat: {lat.toFixed(5)}, Lon: {lon.toFixed(5)}
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            {/* Health Risk Data Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#DC2626', fontSize: '13px' }}>
                Health Risk Data
              </Typography>
              {healthData ? (
                <Box sx={{ fontSize: '11px' }}>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Pathogen Risk:</strong> {healthData.scaled_Pathogen_Risk.toFixed(3)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Fecal Risk:</strong> {healthData.scaled_Fecal_Risk.toFixed(3)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>ARG Risk:</strong> {healthData.scaled_ARG_Risk.toFixed(3)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Overall Score:</strong> {healthData.health_risk_score.toFixed(3)}
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#999' }}>
                  No data available
                </Typography>
              )}
            </Box>

            {/* Resilience Data Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#10B981', fontSize: '13px' }}>
                Resilience Data
              </Typography>
              {resilienceData ? (
                <Box sx={{ fontSize: '11px' }}>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Water Quality:</strong> {resilienceData['Water Resources & Quality'].toFixed(1)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Biodiversity:</strong> {resilienceData['Biodiversity & Habitats'].toFixed(1)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Riverbank:</strong> {resilienceData['Riverbank Protection'].toFixed(1)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Air Quality:</strong> {resilienceData['Air Quality'].toFixed(1)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Land Use:</strong> {resilienceData['Sustainable Land Use & Agriculture'].toFixed(1)}
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Waste:</strong> {resilienceData['Waste Reduction'].toFixed(1)}
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#999' }}>
                  No data available
                </Typography>
              )}
            </Box>

            {/* Weather Data Column */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#3B82F6', fontSize: '13px' }}>
                Weather Data
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#666', mb: 1 }}>
                Date: {startDate}
              </Typography>
              {loading ? (
                <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#999' }}>
                  Loading...
                </Typography>
              ) : weatherData ? (
                <Box sx={{ fontSize: '11px' }}>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Temperature:</strong> {weatherData.temperature.toFixed(1)}°C
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Humidity:</strong> {weatherData.humidity.toFixed(0)}%
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Wind:</strong> {weatherData.windSpeed.toFixed(1)} m/s
                  </Box>
                  <Box sx={{ mb: 0.5 }}>
                    <strong>Precipitation:</strong> {weatherData.precipitation.toFixed(1)} mm
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#999' }}>
                  No data available
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Popup>
    </Circle>
  );
}

export function CityMap() {
  const { city, site, startDate, selectedWeatherMetrics, selectedHealthRisks, setCity, setSite } =
    useSelection();
  const [loading, setLoading] = useState(true);
  const [sitesToShow, setSitesToShow] = useState<ResearchSite[]>([]);
  const [selectedSiteCoords, setSelectedSiteCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [mapType, setMapType] = useState<"satellite" | "street">("satellite");

  useEffect(() => {
    setLoading(true);

    if (city) {
      const citySites = getSitesByCity(city);

      if (site === "all") {
        setSitesToShow(citySites);
        // For 'all', use city center coordinates
        const cityCoords = getCityCoordinates(city);
        setSelectedSiteCoords({ lat: cityCoords.lat, lon: cityCoords.lng });
      } else if (site) {
        const selectedSite = getSite(city, site);
        setSitesToShow(selectedSite ? [selectedSite] : citySites);
        // Set coordinates for the selected site
        if (selectedSite) {
          setSelectedSiteCoords({
            lat: selectedSite.Latitude,
            lon: selectedSite.Longitude,
          });
        }
      } else {
        setSitesToShow(citySites);
        setSelectedSiteCoords(null);
      }
    } else {
      setSelectedSiteCoords(null);
    }

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [city, site]);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading {city} map...
        </Typography>
      </LoadingContainer>
    );
  }

  // Show Europe-centered map when no city is selected
  if (!city) {
    const cities = getUniqueCities();

    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Map Type Toggle */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}>
          <Box
            onClick={() => setMapType("satellite")}
            sx={{
              padding: "6px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: mapType === "satellite" ? "#4A90E2" : "white",
              color: mapType === "satellite" ? "white" : "#6B7280",
              border: "1px solid #E5E7EB",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor:
                  mapType === "satellite" ? "#3A7BC8" : "#F3F4F6",
              },
            }}
          >
            Satellite
          </Box>
          <Box
            onClick={() => setMapType("street")}
            sx={{
              padding: "6px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: mapType === "street" ? "#4A90E2" : "white",
              color: mapType === "street" ? "white" : "#6B7280",
              border: "1px solid #E5E7EB",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: mapType === "street" ? "#3A7BC8" : "#F3F4F6",
              },
            }}
          >
            Street
          </Box>
        </Box>
        <StyledMapContainer sx={{ flex: 1, minHeight: 0 }}>
          <MapContainer
            center={[47.0, 2.0]} // Center of Europe (France)
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            {mapType === "satellite" ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            )}

            {/* City circles - clickable to select city */}
            {cities.map((cityName) => {
              const cityCoords = getCityCoordinates(cityName);
              const citySites = getSitesByCity(cityName);

              return (
                <Circle
                  key={cityName}
                  center={[cityCoords.lat, cityCoords.lng]}
                  radius={35000} // 15km radius
                  pathOptions={{
                    color: "#000",
                    fillColor: "#10B981",
                    fillOpacity: 0.9,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      setCity(cityName as City);
                      setSite(null);
                    },
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 150 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, fontSize: "14px" }}
                      >
                        {cityName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "12px", mb: 1 }}
                      >
                        {citySites.length} research site
                        {citySites.length !== 1 ? "s" : ""}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "11px",
                          color: "#4A90E2",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => {
                          setCity(cityName as City);
                          setSite(null);
                        }}
                      >
                        Click to select →
                      </Typography>
                    </Box>
                  </Popup>
                </Circle>
              );
            })}
          </MapContainer>
        </StyledMapContainer>
      </Box>
    );
  }

  if (sitesToShow.length === 0) {
    return (
      <LoadingContainer>
        <Typography variant="body2" color="error">
          No sites found for {city}
        </Typography>
      </LoadingContainer>
    );
  }

  const cityCoords = getCityCoordinates(city);

  // Get map center - use selected site if available, otherwise city center
  const getMapCenter = (): [number, number] => {
    if (site && site !== "all") {
      const selectedSite = getSite(city, site);
      if (selectedSite) {
        return [selectedSite.Latitude, selectedSite.Longitude];
      }
    }
    return [cityCoords.lat, cityCoords.lng];
  };

  // Create custom icon with health risk symbol
  const createHealthRiskIcon = (siteNr: string) => {
    const healthData = getHealthRiskForSite(siteNr);
    if (!healthData) {
      // Return default Leaflet icon instead of undefined
      return new L.Icon.Default();
    }

    const value = healthData.health_risk_score;
    let color = "#10B981"; // Green - Low risk
    let symbol = "▼"; // Down triangle

    if (value >= 0.75) {
      color = "#DC2626"; // Dark red - Very high risk
      symbol = "▲"; // Up triangle
    } else if (value >= 0.5) {
      color = "#EF4444"; // Red - High risk
      symbol = "▲"; // Up triangle
    } else if (value >= 0.25) {
      color = "#F59E0B"; // Orange - Moderate risk
      symbol = "▬"; // Dash
    }

    const svgIcon = `
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
        <text x="16" y="20" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${symbol}</text>
      </svg>
    `;

    return new L.DivIcon({
      html: svgIcon,
      className: "health-risk-marker",
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Map Type Toggle and Health Risk Legend */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          gap: 2,
        }}
      >
        {/* Health Risk Legend */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}
          >
            Health Risk:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
                fill="#10B981"
              />
              <text
                x="16"
                y="20"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                ▼
              </text>
            </svg>
            <Typography sx={{ fontSize: "11px", color: "#6b7280" }}>
              Low
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
                fill="#F59E0B"
              />
              <text
                x="16"
                y="20"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                ▬
              </text>
            </svg>
            <Typography sx={{ fontSize: "11px", color: "#6b7280" }}>
              Moderate
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
                fill="#EF4444"
              />
              <text
                x="16"
                y="20"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                ▲
              </text>
            </svg>
            <Typography sx={{ fontSize: "11px", color: "#6b7280" }}>
              High
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 32 40">
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
                fill="#DC2626"
              />
              <text
                x="16"
                y="20"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                ▲
              </text>
            </svg>
            <Typography sx={{ fontSize: "11px", color: "#6b7280" }}>
              Very High
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <svg width="20" height="24" viewBox="0 0 25 41">
              <path
                fill="#2A81CB"
                stroke="#000"
                strokeWidth="2"
                d="M12.5,0.5C6.2,0.5,1,5.7,1,12c0,6.3,11.5,28,11.5,28S24,18.3,24,12C24,5.7,18.8,0.5,12.5,0.5z"
              />
              <circle fill="#FFF" cx="12.5" cy="12" r="5" />
            </svg>
            <Typography sx={{ fontSize: "11px", color: "#6b7280" }}>
              No Data
            </Typography>
          </Box>
        </Box>

        {/* Map Type Toggle */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            onClick={() => setMapType("satellite")}
            sx={{
              padding: "6px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: mapType === "satellite" ? "#4A90E2" : "white",
              color: mapType === "satellite" ? "white" : "#6B7280",
              border: "1px solid #E5E7EB",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor:
                  mapType === "satellite" ? "#3A7BC8" : "#F3F4F6",
              },
            }}
          >
            Satellite
          </Box>
          <Box
            onClick={() => setMapType("street")}
            sx={{
              padding: "6px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor: mapType === "street" ? "#4A90E2" : "white",
              color: mapType === "street" ? "white" : "#6B7280",
              border: "1px solid #E5E7EB",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: mapType === "street" ? "#3A7BC8" : "#F3F4F6",
              },
            }}
          >
            Street
          </Box>
        </Box>
      </Box>
      <StyledMapContainer sx={{ flex: 1, minHeight: 0 }}>
        <MapContainer
          center={getMapCenter()}
          zoom={site && site !== "all" ? 14 : 9}
          style={{ height: "100%", width: "100%" }}
          key={`${city}-${site}`}
        >
          {/* Map Position Controller - repositions map when charts are shown */}
          <MapPositionController 
            siteCoords={selectedSiteCoords} 
            showCharts={site !== null && site !== 'all' && selectedHealthRisks.length > 0}
          />

          {mapType === "satellite" ? (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}

          {sitesToShow.map((siteData) => {
            const healthData = getHealthRiskForSite(siteData["Site Nr."]);
            const customIcon = createHealthRiskIcon(siteData["Site Nr."]);

            return (
              <Marker
                key={siteData["Site Nr."]}
                position={[siteData.Latitude, siteData.Longitude]}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    setSite(siteData["Site Nr."] as Site);
                  },
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {siteData["Site Nr."]} - {siteData["Site Name"]}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>City:</strong> {siteData.City}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Coordinates:</strong>{" "}
                      {siteData.Latitude.toFixed(5)},{" "}
                      {siteData.Longitude.toFixed(5)}
                    </Typography>
                    {healthData && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, pt: 1, borderTop: "1px solid #E5E7EB" }}
                      >
                        <strong>Health Risk Score:</strong>{" "}
                        {healthData.health_risk_score.toFixed(3)}
                      </Typography>
                    )}
                    {/* <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        fontSize: "11px",
                        color: "#4A90E2",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => {
                        setSite(siteData["Site Nr."] as Site);
                      }}
                    >
                      Click to select this site →
                    </Typography> */}
                  </Box>
                </Popup>
              </Marker>
            );
          })}

          {/* Site radius circle - always show when site is selected */}
          {selectedSiteCoords && site && site !== 'all' && (
            <SiteCircleWithPopup
              lat={selectedSiteCoords.lat}
              lon={selectedSiteCoords.lon}
              city={city!}
              site={site}
              startDate={startDate}
            />
          )}

          {/* Weather Info Box - show selected weather data as a list */}
          {selectedSiteCoords &&
            startDate &&
            selectedWeatherMetrics.length > 0 && (
              <WeatherInfoBox
                lat={selectedSiteCoords.lat}
                lon={selectedSiteCoords.lon}
                date={startDate}
                selectedMetrics={selectedWeatherMetrics}
              />
            )}
        </MapContainer>

        {/* Health Risk Charts Overlay - 2 rows from center to right */}
        {site && site !== 'all' && selectedHealthRisks.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              right: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              zIndex: 1010,
              pointerEvents: 'none',
              '& > *': {
                pointerEvents: 'auto',
              },
            }}
          >
            {/* Row 1: Metrics Cards */}
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.55)',
                marginRight: '8px',
                // backdropFilter: 'blur(8px)',
                borderRadius: '6px',
                padding: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                overflow: 'visible',
              }}
            >
              <Box sx={{ transform: 'scale(0.64)', transformOrigin: 'top left' }}>
                <MetricsCards />
              </Box>
            </Box>

            {/* Row 2: Charts side by side */}
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
              }}
            >
              {/* Ecosystem Pie Chart */}
              <Box
                sx={{
                  flex: 1,
                  // margin: '8px',
                  background: 'rgba(255, 255, 255, 0.55)',
                  // backdropFilter: 'blur(8px)',
                  borderRadius: '6px',
                  padding: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  height: '200px',
                  overflow: 'hidden',
                }}
              >
                <Typography variant="h6" sx={{ mb: 0.5, fontSize: '10px', fontWeight: 600 }}>
                  Risk Distribution
                </Typography>
                <Box sx={{ transform: 'scale(0.6)', transformOrigin: 'top center', marginTop: '-20px' }}>
                  <EcosystemChart />
                </Box>
              </Box>

              {/* Category Bar Chart */}
              <Box
                sx={{
                  flex: 1,
                  marginRight: '8px',
                  background: 'rgba(255, 255, 255, 0.65)',
                  // backdropFilter: 'blur(8px)',
                  borderRadius: '6px',
                  padding: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  height: '230px',
                  overflow: 'visible',
                }}
              >
                <Typography variant="h6" sx={{ mb: 0.5, fontSize: '10px', fontWeight: 600 }}>
                  Risk Breakdown
                </Typography>
                <Box sx={{ 
                  transform: 'scale(0.6)', 
                  transformOrigin: 'top left',
                  marginTop: '0px',
                  marginLeft: '-20px'
                }}>
                  <CategoryChart />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </StyledMapContainer>
    </Box>
  );
}
