import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/api';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Configured axios instance for API calls
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Response interceptor for centralized error handling
 */
apiClient.interceptors.response.use(
  // Success response - pass through
  (response) => response,
  
  // Error response - handle centrally
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    // Network error (no response from server)
    if (!error.response) {
      apiError.message = 'Network error. Please check your connection and ensure the backend is running.';
      console.error('Network Error:', error.message);
      return Promise.reject(apiError);
    }

    // HTTP error responses
    const status = error.response.status;
    const serverMessage = (error.response.data as any)?.message;

    switch (status) {
      case 400:
        apiError.message = serverMessage || 'Bad request. Please check your input.';
        break;
      case 401:
        apiError.message = 'Unauthorized. Please log in.';
        break;
      case 403:
        apiError.message = 'Forbidden. You do not have permission to access this resource.';
        break;
      case 404:
        apiError.message = serverMessage || 'Resource not found.';
        break;
      case 500:
        apiError.message = 'Server error. Please try again later.';
        break;
      case 503:
        apiError.message = 'Service unavailable. The server is temporarily down.';
        break;
      default:
        apiError.message = serverMessage || `Request failed with status ${status}`;
    }

    console.error('API Error:', {
      status,
      message: apiError.message,
      url: error.config?.url,
      data: error.response.data,
    });

    return Promise.reject(apiError);
  }
);

/**
 * Helper function to handle API errors in components
 */
export const handleApiError = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Type guard for ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
};
