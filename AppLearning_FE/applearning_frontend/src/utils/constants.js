
// src/utils/constants.js
export const API_BASE_URL = 'http://localhost:5050'; 
export const OAUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: '976124393303-rlu8pmavq33q5q0781jbglma8ntglmb7.apps.googleusercontent.com',
  },
  FACEBOOK: {
    APP_ID: '805393175371694',
    SDK_VERSION: 'v18.0',
  },
};
export const ROUTES = {
  // Public routes
  FIRST: '/first',
  LOGIN: '/login',
  GOOGLELOGIN: '/googlelogin',
  REGISTER: '/register',
  
  // Protected routes
  LEARN: '/learn',
  PRACTICE: '/practice',
  LEADERBOARDS: '/leaderboards',
  FRIEND: '/friend',
  PROFILE: '/profile',
  VOCABULARYLEARN: '/vocabularylearn',
  // Admin routes
  ADMIN: '/admin',
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    LOGOUT: '/api/Auth/logout',
    REFRESH_TOKEN: '/api/Auth/refresh-token',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/User/profile',
    UPDATE_PROFILE: '/api/User/update-profile',
  },
  
  // Add more endpoints as needed
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

// ============ HTTP STATUS CODES ============
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default {
  API_BASE_URL,
  ROUTES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  HTTP_STATUS,
};