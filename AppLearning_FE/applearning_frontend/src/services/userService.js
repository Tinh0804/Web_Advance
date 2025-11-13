import axiosInstance from './axiosConfig';

const userService = {
  /**
   * Lấy thông tin profile
   * @returns {Promise}
   */
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/User/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật profile
   * @param {object} userData - {firstName, lastName, nativeLanguage, avatar...}
   * @returns {Promise}
   */
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/api/User/profile', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thống kê user (XP, streak, hearts...)
   * @returns {Promise}
   */
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/api/User/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy lịch sử học tập
   * @returns {Promise}
   */
  getLearningHistory: async () => {
    try {
      const response = await axiosInstance.get('/api/User/learning-history');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload avatar
   * @param {File} file 
   * @returns {Promise}
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axiosInstance.post('/api/User/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách bạn bè
   * @returns {Promise}
   */
  getFriends: async () => {
    try {
      const response = await axiosInstance.get('/api/User/friends');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Thêm bạn
   * @param {string} userId 
   * @returns {Promise}
   */
  addFriend: async (userId) => {
    try {
      const response = await axiosInstance.post(`/api/User/friends/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa bạn
   * @param {string} userId 
   * @returns {Promise}
   */
  removeFriend: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/User/friends/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;