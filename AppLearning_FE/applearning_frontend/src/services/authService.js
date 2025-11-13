// src/services/authService.js
import axiosInstance from './axiosConfig';

const authService = {
  register: async (userData) => {
    try {
      console.log('Sending data:', userData);
      const response = await axiosInstance.post('/api/Auth/register', userData);
      console.log('Response:', response);
      return response.data;

    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        const { data } = error.response;
        const errorMessage = data?.message || data?.Message || data?.error || 'Registration failed';
        throw errorMessage;
      } 
      else if (error.request) 
        throw 'Cannot connect to server. Please check if backend is running.';
      else 
        throw error.message || 'Registration failed. Please try again.';
    }
  },

  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('/api/Auth/login', {username,password,});
      console.log('Response(login):', response);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) 
          localStorage.setItem('refreshToken', response.data.refreshToken);
        if (response.data.user) 
          localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error(login):', error);
      if (error.response) {
        const { data } = error.response;
        const errorMessage = data?.message || data?.Message || 'Login failed';
        throw errorMessage;
      } 
      else if (error.request) 
        throw 'Cannot connect to server';
      else 
        throw error.message || 'Login failed';
    }
  },

  // External login (Google, Facebook)
  externalLogin: async (provider, accessToken) => {
    try {
      console.log(`External login with ${provider}`);
      const response = await axiosInstance.post('/api/Auth/external-login', {provider,accessToken});

      console.log('Response(external-login):', response);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) 
          localStorage.setItem('refreshToken', response.data.refreshToken);
        if (response.data.user) 
          localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error(`Error(${provider}-login):`, error);
      if (error.response) {
        const { data } = error.response;
        const errorMessage = data?.message || data?.Message || `${provider} login failed`;
        throw errorMessage;
      } 
      else if (error.request) 
        throw 'Cannot connect to server';
      else 
        throw error.message || `${provider} login failed`;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  getToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    return !!(token && user);
  },
};

export default authService;