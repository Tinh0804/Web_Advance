import axiosInstance from './axiosConfig';

const exerciseService = {
  getByLesson: async (lessonId) => {
    const response = await axiosInstance.get(`/api/Exercises/lesson/${lessonId}`);
    return response.data;
  },

  submit: async (data) => {
    const response = await axiosInstance.post(`/api/Exercises/submit`, data);
    return response.data;
  }
};

export default exerciseService;
