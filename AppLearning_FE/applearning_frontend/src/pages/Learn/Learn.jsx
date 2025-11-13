import { useEffect, useState } from 'react';

const Learn = () => {
  
  // TODO: Replace with API call
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - test structure giống API response
  const mockCourseData = {
    courseId: 1,
    courseName: "Tiếng Việt",
    units: [
      {
        unitId: 1,
        unitNumber: 1,
        unitTitle: "Mời khách xơi nước",
        lessons: [
          { 
            lessonId: 1, 
            lessonNumber: 1, 
            type: 'lesson', 
            isLocked: false, 
            isCompleted: false,
            stars: 0,
            title: 'BẮT ĐẦU'
          },
          { 
            lessonId: 2, 
            lessonNumber: 2, 
            type: 'lesson', 
            isLocked: true, 
            isCompleted: false,
            stars: 0 
          },
          { 
            lessonId: 3, 
            lessonNumber: 3, 
            type: 'chest', 
            isLocked: true, 
            isCompleted: false 
          },
          { 
            lessonId: 4, 
            lessonNumber: 4, 
            type: 'lesson', 
            isLocked: true, 
            isCompleted: false,
            stars: 0 
          },
          { 
            lessonId: 5, 
            lessonNumber: 5, 
            type: 'trophy', 
            isLocked: true, 
            isCompleted: false 
          }
        ]
      },
      // Unit 2 - example
      {
        unitId: 2,
        unitNumber: 2,
        unitTitle: "Giới thiệu góc gác",
        lessons: [
          { 
            lessonId: 6, 
            lessonNumber: 1, 
            type: 'lesson', 
            isLocked: true, 
            isCompleted: false,
            stars: 0 
          },
        ]
      }
    ]
  };

  // Fetch course data on mount
  useEffect(() => {
    // TODO: API call
    const fetchCourseData = async () => {
      try {
        setLoading(true);
    
        // const response = await fetch('/api/courses/current');
        // const data = await response.json();
        // setCourseData(data);
        
        // Mock delay
        setTimeout(() => {
          setCourseData(mockCourseData);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching course data:', error);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);
  
  const handleLessonClick = (lesson) => {
    if (lesson.isLocked) return;
    
    // TODO: Navigate to lesson page
    console.log('Starting lesson:', lesson);
    // navigate(`/lesson/${lesson.lessonId}`);
  };

  const handleUnitGuideClick = (unitId) => {
    console.log('Show guide for unit:', unitId);
  };


  const renderLessonNode = (lesson, index, totalLessons) => {
    const isFirstLesson = index === 0;
    const showDuoAfter = index === 1; // Duo xuất hiện sau lesson 2

    return (
      <div key={lesson.lessonId} className="flex flex-col items-center">
        {/* Lesson Button */}
        <button
          onClick={() => handleLessonClick(lesson)}
          disabled={lesson.isLocked}
          className={`
            relative group
            ${lesson.isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${isFirstLesson ? 'mb-4' : 'mb-6'}
          `}
        >
          {/* First Lesson - Large with "BẮT ĐẦU" label */}
          {isFirstLesson && (
            <>
              {/* Label */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl border-2 border-gray-200 shadow-md">
                <span className="text-green-600 font-bold text-sm whitespace-nowrap">
                  BẮT ĐẦU
                </span>
              </div>
              
              {/* Large Star Button */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white border-b-8 border-gray-200 flex items-center justify-center shadow-lg overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-green-400 to-green-500 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Progress Ring - only if in progress */}
                {!lesson.isCompleted && lesson.stars > 0 && (
                  <svg className="absolute top-0 left-0 w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="#58cc02"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="276.46"
                      strokeDashoffset={276.46 * (1 - lesson.stars / 3)}
                      className="transition-all duration-300"
                    />
                  </svg>
                )}
              </div>
            </>
          )}

          {/* Regular Lessons */}
          {!isFirstLesson && lesson.type === 'lesson' && (
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              border-b-8 shadow-lg transition-transform hover:scale-105
              ${lesson.isLocked 
                ? 'bg-gray-300 border-gray-400' 
                : lesson.isCompleted
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-400 border-yellow-500'
                : 'bg-gray-200 border-gray-300'
              }
            `}>
              {lesson.isLocked ? (
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"/>
                </svg>
              ) : (
                <svg className="w-10 h-10 text-gray-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              )}
            </div>
          )}

          {/* Chest/Treasure */}
          {lesson.type === 'chest' && (
            <div className="w-20 h-20 rounded-full bg-gray-300 border-b-8 border-gray-400 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm6 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
          )}

          {/* Trophy/Unit Review */}
          {lesson.type === 'trophy' && (
            <div className="w-20 h-20 rounded-full bg-gray-300 border-b-8 border-gray-400 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          )}
        </button>

        {showDuoAfter && (
          <div className="absolute right-0 top-20 transform translate-x-10">
            <div className="w-32 h-32 relative">
              <img 
                src={require('../../assets/images/applelogo.png')}
                alt="Mascot" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUnit = (unit) => {
    return (
      <div key={unit.unitId} className="mb-16">
        {/* Unit Header */}
        <div className="bg-green-500 rounded-2xl p-6 mb-12 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="text-sm font-bold mb-1 opacity-90">
                ← PHẦN {unit.unitNumber}, CỬA {unit.unitNumber}
              </div>
              <h2 className="text-2xl font-bold">{unit.unitTitle}</h2>
            </div>
            <button 
              onClick={() => handleUnitGuideClick(unit.unitId)}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              HƯỚNG DẪN
            </button>
          </div>
        </div>

        {/* Learning Path */}
        <div className="relative flex flex-col items-center">
          {/* Vertical connecting line */}
          <div className="absolute top-0 bottom-0 w-1 bg-gray-200 -z-10"></div>

          {/* Render all lessons */}
          {unit.lessons.map((lesson, index) => 
            renderLessonNode(lesson, index, unit.lessons.length)
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy khóa học</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Render all units */}
      {courseData.units.map(unit => renderUnit(unit))}

      {/* Bottom Divider */}
      <div className="relative my-16">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-gray-400 font-bold">
            Giới thiệu góc gác
          </span>
        </div>
      </div>

      {/* Jump Ahead Section */}
      <div className="text-center pb-16">
        {/* Label */}
        <div className="inline-block bg-white px-6 py-3 rounded-2xl border-2 border-purple-300 shadow-md mb-6">
          <span className="text-purple-600 font-bold">HỌC VƯỢT?</span>
        </div>

        {/* Button */}
        <button className="w-20 h-20 rounded-full bg-gradient-to-b from-purple-400 to-purple-500 border-b-8 border-purple-600 shadow-xl hover:scale-105 transition-transform flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        {/* Next locked lesson preview */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 border-b-8 border-gray-400 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-gray-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;