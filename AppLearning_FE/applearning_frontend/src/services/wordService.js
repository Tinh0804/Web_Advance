import axiosInstance from './axiosConfig';

const wordService = {
  // Lấy danh sách từ vựng theo bài học
  getWordsByLessonId: async (lessonId) => {
    try {
      const response = await axiosInstance.get(`/api/Words/lesson/${lessonId}`);

      // Backend trả về: { status: true, data: [...], message: "..." }
      if (response.data.status && Array.isArray(response.data.data)) {
        return response.data.data.map(word => ({
          wordId: word.wordId || word.id,
          wordName: word.wordName || word.english || word.word,
          translation: word.translation || word.vietnamese || word.meaning,
          pronunciation: word.pronunciation || word.ipa || '',
          imageUrl: word.imageUrl || word.image || 'https://via.placeholder.com/400',
          audioFile: word.audioFile || word.audio || '',
          exampleSentence: word.exampleSentence || word.example || '',
          languageId: word.languageId || 1,
        }));
      } else {
        console.warn("API trả về không có dữ liệu:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Lỗi khi lấy từ vựng bài học:", error);
      
      // Xử lý lỗi chi tiết hơn nếu cần
      if (error.response?.status === 401) {
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
      if (error.response?.status === 404) {
        throw new Error("Bài học không tồn tại hoặc chưa có từ vựng.");
      }

      throw error; // hoặc return [] nếu muốn im lặng
    }
  },

  // (Tùy chọn) Tìm kiếm từ
  searchWords: async (keyword) => {
    try {
      const response = await axiosInstance.get('/api/Words/search', {
        params: { keyword }
      });
      return response.data.status ? response.data.data : [];
    } catch (error) {
      console.error("Lỗi tìm kiếm từ:", error);
      return [];
    }
  }
};

export default wordService;