// src/pages/Practice/PracticeLesson.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import lessonService from '../../services/lessonService';

class PracticeLesson extends React.Component {
  state = {
    lessons: [],
    unitName: '',
    loading: true,
    error: null,
  };

  async componentDidMount() {
    const { unitId } = this.props.params;
    try {
      const lessons = await lessonService.getLessonsByUnitId(unitId);
      this.setState({
        lessons,
        unitName: lessons[0]?.unitName || `Unit ${unitId}`,
        loading: false,
      });
    } catch (error) {
      this.setState({ error: 'Không tải được bài học', loading: false });
    }
  }

  handleLessonClick = (lessonId) => {
    this.props.navigate(`/practice/lesson/${lessonId}/games`);
  };

  render() {
    const { lessons, unitName, loading, error } = this.state;
    const navigate = this.props.navigate;

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài học...</p>
        </div>
      );
    }

    if (error || lessons.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <p className="text-xl text-gray-600 mb-4">Không có bài học nào</p>
          <button onClick={() => navigate(-1)} className="text-purple-600 underline">
            ← Quay lại
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-purple-600 font-medium flex items-center gap-2 hover:gap-3 transition-all"
          >
            ← Quay lại danh sách Unit
          </button>

          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            {unitName}
          </h1>

          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.lessonId}
                onClick={() => this.handleLessonClick(lesson.lessonId)}
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex items-center gap-6 border-2 border-transparent hover:border-purple-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {index + 1}
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {lesson.lessonName || `Lesson ${index + 1}`}
                  </h3>
                  {lesson.learned > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Đã luyện tập {lesson.learned} lần
                    </p>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition text-purple-600 font-bold text-lg">
                  →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const PracticeLessonWithRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  return <PracticeLesson params={params} navigate={navigate} />;
};

export default PracticeLessonWithRouter;