// src/services/authService.js
import axiosInstance from './axiosConfig';

const authService = {
  // === REGISTER ===
  async register(userData) {
    try {
      const response = await axiosInstance.post('/api/Auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(_handleError(error, 'Registration failed'));
    }
  },

  // === LOGIN ===
  async login(username, password) {
    try {
      const response = await axiosInstance.post('/api/Auth/login', {
        username,
        password,
      });

      const { data } = response.data; // API trả về { status: true, data: { ... } }

      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      if (data?.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return response.data;
    } catch (error) {
      const message = _handleError(error, 'Login failed');
      return { status: false, message };
    }
  },

  // === EXTERNAL LOGIN (Google, Facebook) ===
  async externalLogin(provider, accessToken) {
    try {
      const response = await axiosInstance.post('/api/Auth/external-login', {
        provider,
        accessToken,
      });

      const { token, refreshToken, user } = response.data;

      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message
        || error.response?.data?.Message
        || error.message
        || `${provider} login failed`;

      throw new Error(message);
    }
  },

  // === LOGOUT ===
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  // === GET CURRENT USER ===
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // === GET TOKEN ===
  getToken() {
    return localStorage.getItem('token');
  },

  // === CHECK AUTH ===
  isAuthenticated() {
    return !!authService.getToken();
  },
};

// === PRIVATE: Unified error handler ===
const _handleError = (error, defaultMsg) => {
  if (error.response?.data) {
    const data = error.response.data;
    return data.message || data.Message || data.error || defaultMsg;
  }
  if (error.request) {
    return 'Cannot connect to server. Please check your internet connection.';
  }
  return error.message || defaultMsg;
};

export default authService;