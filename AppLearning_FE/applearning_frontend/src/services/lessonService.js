import axiosInstance from './axiosConfig';

const lessonService = {
  getLessonsByUnitId: async (unitId) => {
    try {
      const response = await axiosInstance.get(`/api/Lessons/unit/${unitId}`);

      if (response.data.status) {
        return response.data.data.map(lesson => ({
          ...lesson,
          learned: lesson.learned ?? 0,
        }));
      } else {
        console.error("API error:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài học:", error);
      return [];
    }
  }
};

export default lessonService;
