import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import FormData from "form-data";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:4000",
  "null" // For local file:// protocol
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin === "null") {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true
}));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Resilience Map Backend API is running",
    timestamp: new Date().toISOString()
  });
});

// Air quality data endpoint
app.post("/api/airquality", async (req, res) => {
  const { variable, start_date, end_date, area } = req.body;

  // Validate required fields
  if (!variable || !start_date || !end_date || !area) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["variable", "start_date", "end_date", "area"]
    });
  }

  // Validate area format [North, West, South, East]
  if (!Array.isArray(area) || area.length !== 4) {
    return res.status(400).json({
      error: "Invalid area format. Expected [North, West, South, East]"
    });
  }

  // Check for API credentials
  if (!process.env.ADS_API_EMAIL || !process.env.ADS_API_KEY) {
    return res.status(500).json({
      error: "Server configuration error: Missing ADS API credentials"
    });
  }

  // Build the request payload according to CDS API format
  const requestPayload = {
    product_type: "reanalysis",
    variable,
    date: `${start_date}/${end_date}`,
    time: "00:00",
    area, // [North, West, South, East]
    format: "netcdf"
  };

  console.log("Fetching air quality data:", {
    variable,
    date_range: `${start_date} to ${end_date}`,
    area,
    payload: requestPayload,
    timestamp: new Date().toISOString()
  });

  try {
    // The ADS API uses UID:API_KEY format for authentication
    const authString = `${process.env.ADS_API_EMAIL}:${process.env.ADS_API_KEY}`;
    const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`;

    console.log("Submitting request to ECMWF ADS API...");
    console.log("Endpoint: https://ads.atmosphere.copernicus.eu/api/retrieve/v1/processes/cams-global-reanalysis-eac4/execute");

    // Step 1: Submit the request to get a job ID using the new API format
    const submitResponse = await axios.post(
      "https://ads.atmosphere.copernicus.eu/api/retrieve/v1/processes/cams-global-reanalysis-eac4/execute",
      {
        inputs: requestPayload
      },
      {
        headers: {
          "Content-Type": "application/json",
          "PRIVATE-TOKEN": process.env.ADS_API_KEY
        },
        timeout: 30000,
        validateStatus: function (status) {
          return status < 500; // Don't throw on 4xx errors
        }
      }
    );

    console.log("Response status:", submitResponse.status);
    console.log("Response data:", JSON.stringify(submitResponse.data, null, 2));

    // Handle different response scenarios
    if (submitResponse.status === 404) {
      return res.status(404).json({
        error: "Dataset or endpoint not found",
        message: "The CAMS dataset might not be available or the endpoint is incorrect",
        details: submitResponse.data,
        hint: "Check if your ECMWF ADS account has access to CAMS Global Reanalysis EAC4"
      });
    }

    if (submitResponse.status === 401 || submitResponse.status === 403) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid API credentials or insufficient permissions",
        hint: "Verify your ADS_API_EMAIL and ADS_API_KEY in the .env file"
      });
    }

    // Check if we got a job ID or direct data
    if (submitResponse.data.state === "completed" && submitResponse.data.location) {
      // Download the result
      const downloadResponse = await axios.get(submitResponse.data.location, {
        responseType: "arraybuffer",
        timeout: 120000
      });
      
      console.log("Successfully retrieved air quality data");
      res.setHeader("Content-Type", "application/x-netcdf");
      res.setHeader("Content-Disposition", `attachment; filename="airquality_${start_date}_${end_date}.nc"`);
      res.send(downloadResponse.data);
    } else {
      // Job is queued/running - return job info
      res.json({
        message: "Request submitted. Job is being processed.",
        job_id: submitResponse.data.request_id,
        state: submitResponse.data.state,
        note: "ECMWF processes requests asynchronously. This may take several minutes."
      });
    }
  } catch (err) {
    console.error("Error retrieving air quality data:", err.message);
    
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(err.response.status).json({
        error: "ECMWF API error",
        message: err.message,
        status: err.response.status
      });
    } else if (err.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: "No response from ECMWF API",
        message: "The ECMWF service may be temporarily unavailable"
      });
    } else {
      // Something happened in setting up the request
      res.status(500).json({
        error: "Internal server error",
        message: err.message
      });
    }
  }
});

// Get available variables endpoint (helper)
app.get("/api/variables", (req, res) => {
  res.json({
    available_variables: [
      // Correct CAMS EAC4 variable names
      "carbon_monoxide",
      "nitrogen_dioxide",
      "nitrogen_monoxide",
      "sulphur_dioxide",
      "ozone",
      "particulate_matter_10um",
      "particulate_matter_2.5um",
      "particulate_matter_1um",
      "dust_aerosol_optical_depth_550nm",
      "total_aerosol_optical_depth_550nm",
      "total_aerosol_optical_depth_1240nm",
      "total_aerosol_optical_depth_469nm",
      "total_aerosol_optical_depth_670nm",
      "total_aerosol_optical_depth_865nm"
    ],
    note: "CAMS Global Reanalysis EAC4 variables. See: https://ads.atmosphere.copernicus.eu/cdsapp#!/dataset/cams-global-reanalysis-eac4"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Resilience Map Backend API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});
