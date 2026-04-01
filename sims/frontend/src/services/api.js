import axios from 'axios';

/**
 * api.js - Configured Axios instance for all API calls.
 *
 * Features:
 * - Base URL points to Spring Boot backend
 * - Request interceptor automatically adds JWT token to every request
 * - Response interceptor handles 401 errors (token expired)
 */

// Create axios instance with base config
const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Runs before EVERY API call.
 * Reads the JWT token from localStorage and adds it to the
 * Authorization header as "Bearer <token>".
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add JWT to every request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor - Runs after EVERY API response.
 * If server returns 401 (Unauthorized), clear session and redirect to login.
 * This handles expired tokens automatically.
 */
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - force logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
