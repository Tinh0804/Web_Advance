// src/services/userService.js (đã sửa + tối ưu + fix lỗi)
import axiosInstance from './axiosConfig';

const userService = {
  // Lấy thông tin profile
  getProfile: async () => {
    const response = await axiosInstance.get('/api/Profile/myInfo');
    return response.data.data; 
  },

  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/api/User/profile', userData);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/api/User/stats');
    return response.data;
  },

  getLearningHistory: async () => {
    const response = await axiosInstance.get('/api/User/learning-history');
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.post('/api/User/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getFriends: async () => {
    const response = await axiosInstance.get('/api/User/friends');
    return response.data;
  },

  addFriend: async (userId) => {
    const response = await axiosInstance.post(`/api/User/friends/${userId}`);
    return response.data;
  },

  removeFriend: async (userId) => {
    const response = await axiosInstance.delete(`/api/User/friends/${userId}`);
    return response.data;
  },
};

export default userService;