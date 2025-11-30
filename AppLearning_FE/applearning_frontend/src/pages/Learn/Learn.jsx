// src/pages/Learn.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import unitService from '../../services/unitService';

const Learn = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const courseId = 1;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const units = await unitService.getUnitsByCourseId(courseId);

        if (!units || units.length === 0) {
          setCourseData(null);
          return;
        }
        const unitsWithLessons = await Promise.all(
          units.map(async (unit) => {
            const lessons = await lessonService.getLessonsByUnitId(unit.unitId);
            return { ...unit, lessons };
          })
        );

        setCourseData({
          courseId,
          courseName: "Tiếng Việt",
          units: unitsWithLessons,
        });

      } catch (error) {
        console.error("Lỗi khi tải khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Khi click bài học - navigate đến trang VocabularyLearn
  const handleLessonClick = (lesson, unit) => {
    if (lesson.unlockRequired && unit.isLocked) {
      console.log("Bài học bị khoá.");
      return;
    }
    
    // Navigate đến trang vocabulary với lessonId
    navigate(`/vocabulary/${lesson.lessonId}`, {
      state: {
        lessonName: lesson.lessonName,
        unitName: unit.unitName
      }
    });
  };

  const getPosition = (index) => {
    if (index === 0) return 'items-center';
    if (index % 2 === 1) return 'items-center -translate-x-12';
    return 'items-center translate-x-12';
  };

  // Render từng lesson node
  const renderLessonNode = (lesson, unit, lessonIndex, totalLessons) => {
    const isLocked = lesson.unlockRequired && unit.isLocked;
    const isFirst = lessonIndex === 0;
    const isChest = lessonIndex === 2;
    const isTrophy = lessonIndex === totalLessons - 1 && totalLessons > 3;
    const showMascot = lessonIndex === 2;

    return (
      <div key={lesson.lessonId} className={`flex flex-col ${getPosition(lessonIndex)} mb-6`}>
        <div className="relative flex items-center">

          {/* Lesson button */}
          <button
            onClick={() => handleLessonClick(lesson, unit)}
            disabled={isLocked}
            className={`relative transition-transform ${isLocked ? 'cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isFirst ? (
              /* FIRST NODE */
              <div className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1.5 rounded-xl border-2 border-gray-200 shadow-sm z-10">
                  <span className="text-green-500 font-bold text-sm">BẮT ĐẦU</span>
                </div>

                <div
                  className="w-[88px] h-[88px] rounded-full p-1"
                  style={{
                    background: 'conic-gradient(#22c55e 0deg, #22c55e 270deg, #e5e7eb 270deg, #e5e7eb 360deg)'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white p-1">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-green-400 to-green-500 flex items-center justify-center shadow-md">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) : isChest ? (
              /* CHEST NODE */
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center shadow-lg border-b-4 border-gray-400">
                <div className="relative">
                  <div className="w-14 h-10 bg-gradient-to-b from-amber-600 to-amber-700 rounded-md relative">
                    {/* lid */}
                    <div className="absolute -top-3 left-0 right-0 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-t-lg border-b-2 border-amber-700">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-sm"/>
                    </div>
                    {/* lock */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-3 bg-gray-500 rounded-b-sm mt-1"/>
                    </div>
                  </div>
                </div>
              </div>
            ) : isTrophy ? (
              /* TROPHY */
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-b-4 border-gray-400 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
            ) : (
              /* NORMAL LESSON */
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-b-4 border-gray-400 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            )}

          </button>

          {/* Mascot */}
          {showMascot && (
            <div className="ml-8">
              <img
                src={require('../../assets/images/applelogo.png')}
                alt="Mascot"
                className="w-28 h-28 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render từng Unit
  const renderUnit = (unit, unitIndex) => {
    const isFirstUnit = unitIndex === 0;

    return (
      <div key={unit.unitId} className="mb-16">
        {isFirstUnit ? (
          /* GREEN HEADER FOR FIRST UNIT */
          <div className="bg-green-500 rounded-2xl p-4 mb-10 mx-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-green-100 text-sm mb-1">
                  <span>←</span>
                  <span>PHẦN {unit.orderIndex}, CỬA {unit.orderIndex}</span>
                </div>
                <h2 className="text-white font-bold text-xl">{unit.unitName}</h2>
              </div>

              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-bold text-sm">HƯỚNG DẪN</span>
              </button>
            </div>
          </div>
        ) : (
          /* DIVIDER FOR NEXT UNITS */
          <div className="relative py-8 mb-10">
            <div className="absolute inset-0 flex items-center px-8">
              <div className="w-full border-t border-gray-300"/>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-400 text-sm">{unit.unitName}</span>
            </div>
          </div>
        )}

        {/* Lessons */}
        <div className="flex flex-col items-center">
          {unit.lessons.map((lesson, index) =>
            renderLessonNode(lesson, unit, index, unit.lessons.length)
          )}
        </div>
      </div>
    );
  };

  // Bottom Section
  const renderBottomSection = () => (
    <div className="mt-8 mb-16">

      {/* Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center px-8">
          <div className="w-full border-t border-gray-300"/>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-gray-400 text-sm">Giới thiệu gốc gác</span>
        </div>
      </div>

      {/* HỌC VƯỢT */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white px-4 py-2 rounded-xl border-2 border-purple-200 shadow-sm">
          <span className="text-purple-500 font-bold text-sm">HỌC VƯỢT?</span>
        </div>

        <button className="w-20 h-20 rounded-full bg-gradient-to-b from-purple-400 to-purple-600 border-b-4 border-purple-700 shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
            <path d="M16 5v14l6-7z" transform="translate(-4, 0)"/>
          </svg>
        </button>

        <div className="mt-4 translate-x-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 border-b-4 border-gray-400 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-600 font-medium">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  // NO DATA
  if (!courseData || !courseData.units || courseData.units.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg font-medium">Không tìm thấy khóa học</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto py-6">

        {courseData.units.map((unit, index) => renderUnit(unit, index))}

        {/* Bottom */}
        {renderBottomSection()}

      </div>
    </div>
  );
};

export default Learn;