// src/utils/constants.js

// ============ BASE URL ============
export const API_BASE_URL = 'http://192.168.99.121:5050'; 

// ============ OAUTH CONFIGURATION ============
export const OAUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: '976124393303-rlu8pmavq33q5q0781jbglma8ntglmb7.apps.googleusercontent.com',
  },
  FACEBOOK: {
    APP_ID: '805393175371694',
    SDK_VERSION: 'v18.0',
  },
};

// ============ ROUTES ============
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
  SETTING: '/setting',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD_HOME: '/admin/', 
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_COURSE_MANAGEMENT: '/admin/course-management',
  ADMIN_LESSON_MANAGEMENT: '/admin/lesson-management',
  ADMIN_USER_MANAGEMENT: '/admin/user-management',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_BLANK: '/admin/blank',
  ADMIN_FORM: '/admin/form',
};

// ============ API ENDPOINTS ============
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
  
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

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
  OAUTH_CONFIG, 
  ROUTES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  HTTP_STATUS,
};