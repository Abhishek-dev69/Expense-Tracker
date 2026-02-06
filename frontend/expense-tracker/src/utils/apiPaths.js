// src/utils/apiPaths.js

// Backend base URL
export const BASE_URL = "http://localhost:5001"

// Auth APIs
export const AUTH_API = {
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  LOGIN: `${BASE_URL}/api/auth/login`,
}

// Dashboard APIs
export const DASHBOARD_API = {
  SUMMARY: `${BASE_URL}/api/dashboard`,
}
