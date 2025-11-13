// src/services/axiosConfig.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set true nếu backend yêu cầu cookies
  timeout: 10000, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Log request để debug
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    });

    // Thêm token vào header nếu có
    const token = localStorage.getItem('token');
    if (token) 
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log response để debug
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      url: response.config.url,
    });
    
    return response;
  },
  (error) => {
    // Log error chi tiết
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
    });

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          console.error('Bad Request:', data);
          break;
        case 401:
          console.error('Unauthorized - Token may be invalid');
          // Clear token và redirect về login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - No permission');
          break;
        case 404:
          console.error('Not Found:', error.config?.url);
          break;
        case 500:
          console.error('Internal Server Error:', data);
          break;
        default:
          console.error(`Error ${status}:`, data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server:', {
        request: error.request,
        message: 'Server is not responding. Please check if backend is running.',
      });
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;