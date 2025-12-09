// src/services/authService.js
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import axiosInstance from './axiosConfig';

const authService = {
  // === REGISTER ===
  async register(userData) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(_handleError(error, 'Registration failed'));
    }
  },

  // === LOGIN ===
  async login(username, password) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      const { data } = response.data;

      if (data?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      }
      if (data?.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      }
      if (data?.user) {
        const userToStore = {
          ...data.user,
          role: data.role 
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToStore));
      }

      return response.data;
    } catch (error) {
      const message = _handleError(error, 'Login failed');
      return { status: false, message };
    }
  },

  // === EXTERNAL LOGIN (Google / Facebook) ===
  async externalLogin(provider, accessToken) {
    try {
      const response = await axiosInstance.post('/api/Auth/external-login', {
        provider,
        accessToken,
      });

      // correct structure: data inside response.data.data
      const result = response.data.data;

      if (result?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
      }
      if (result?.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
      }
      if (result?.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      }

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message ||
        `${provider} login failed`;

      throw new Error(message);
    }
  },

  // === LOGOUT ===
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  // === GET CURRENT USER ===
  getCurrentUser() {
    try {
      const str = localStorage.getItem(STORAGE_KEYS.USER);
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  },

  // === GET TOKEN ===
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // === CHECK AUTH ===
  isAuthenticated() {
    return !!authService.getToken();
  },
};

// === PRIVATE ERROR HANDLER ===
const _handleError = (error, defaultMsg) => {
  if (error.response?.data) {
    const d = error.response.data;
    return d.message || d.Message || d.error || defaultMsg;
  }
  if (error.request) {
    return 'Cannot connect to server. Please check your internet connection.';
  }
  return error.message || defaultMsg;
};

export default authService;
