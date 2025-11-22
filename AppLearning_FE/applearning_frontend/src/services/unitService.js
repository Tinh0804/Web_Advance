// src/services/unitService.js
import axiosInstance from './axiosConfig';
const unitService = {

  getAllUserUnits: async () => {
    try {
      const response = await axiosInstance.get('/api/Units');
      if (response.data.status) {
        return response.data.data; // mảng units
      }
      throw new Error(response.data.message || 'Lấy danh sách unit thất bại');
    } catch (error) {
      console.error('Error fetching all units:', error);
      throw error;
    }
  },
  
  getUnitsByCourseId: async (courseId) => {
    try {
      const response = await axiosInstance.get(`/api/Units/course/${courseId}`);
      if (response.data.status) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Lấy danh sách unit thất bại');
    } catch (error) {
      console.error('Error fetching units:', error);
      throw error;
    }
  },
};

export default unitService;