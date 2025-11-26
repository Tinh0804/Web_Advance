// src/services/exerciseService.js
import axiosInstance from './axiosConfig';

const exerciseService = {
  // Lấy tất cả exercises theo unitId
  getByUnit: async (unitId) => {
    try {
      const response = await axiosInstance.get(`/api/Exercises/unit/${unitId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  // Lấy exercises theo lessonId (nếu cần)
  getByLesson: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/api/Exercises/lesson/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  // Lấy exercise theo type cụ thể
  getByType: async (unitId, exerciseType) => {
    try {
      const response = await axiosInstance.get(`/api/Exercises/unit/${unitId}`);
      const filteredExercises = response.data.data.filter(
        ex => ex.exerciseType === exerciseType
      );
      return {
        ...response.data,
        data: filteredExercises
      };
    } catch (error) {
      console.error('Error fetching exercises by type:', error);
      throw error;
    }
  },

  // Submit kết quả
  submit: async (data) => {
    try {
      const response = await axiosInstance.post('/api/Exercises/submit', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting exercise:', error);
      throw error;
    }
  }
};

export default exerciseService;