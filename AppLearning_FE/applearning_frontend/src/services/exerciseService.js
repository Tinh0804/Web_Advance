// src/services/exerciseService.js
import axiosInstance from './axiosConfig';

const exerciseService = {
  getByUnit: async (unitId) => {
    const response = await axiosInstance.get(`/api/Exercises/unit/${unitId}`);
    return response.data;
  },

  submit: async (data) => {
    const response = await axiosInstance.post(`/api/Exercises/submit`, data);
    return response.data;
  }
};

export default exerciseService;