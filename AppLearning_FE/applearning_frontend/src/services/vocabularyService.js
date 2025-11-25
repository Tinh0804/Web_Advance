import axiosInstance from '../services/axiosConfig';

const vocabularyService = {
    // Lấy tất cả từ vựng theo lesson
    getWordsByLesson: async (lessonId) => {
        try {
            const response = await axiosInstance.get(`/api/Words/lesson/${lessonId}`);
            if (response.data.status) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Lấy danh sách từ vựng thất bại');
        } catch (error) {
            console.error('Error fetching words by lesson:', error);
            throw error;
        }
    },

    // Lấy từ vựng theo khóa học
    getWordsByCourse: async (courseId) => {
        try {
            const response = await axiosInstance.get(`/api/Words/course/${courseId}`);
            if (response.data.status) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Lấy danh sách từ vựng thất bại');
        } catch (error) {
            console.error('Error fetching words by course:', error);
            throw error;
        }
    },

    // Lấy chi tiết một từ vựng
    getWordById: async (wordId) => {
        try {
            const response = await axiosInstance.get(`/api/Words/${wordId}`);
            if (response.data.status) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Lấy thông tin từ vựng thất bại');
        } catch (error) {
            console.error('Error fetching word by id:', error);
            throw error;
        }
    },

    // Lấy từ vựng ngẫu nhiên cho game
    getRandomWordsForGame: async (lessonId, count = 6) => {
        try {
            const allWords = await vocabularyService.getWordsByLesson(lessonId);

            // Shuffle và lấy số lượng từ cần thiết
            const shuffled = allWords.sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(count, allWords.length));
        } catch (error) {
            console.error('Error getting random words:', error);
            throw error;
        }
    },

    // Lưu kết quả học tập
    saveProgress: async (progressData) => {
        try {
            const response = await axiosInstance.post('/api/Progress', progressData);
            if (response.data.status) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Lưu tiến độ thất bại');
        } catch (error) {
            console.error('Error saving progress:', error);
            throw error;
        }
    },

    // Lưu kết quả bài tập
    saveExerciseResult: async (exerciseData) => {
        try {
            const response = await axiosInstance.post('/api/Exercise/result', exerciseData);
            if (response.data.status) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Lưu kết quả bài tập thất bại');
        } catch (error) {
            console.error('Error saving exercise result:', error);
            throw error;
        }
    }
};

export default vocabularyService;