import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Heart, Flag, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';

const VocabularyLesson = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const vocabList = [
    { id: 1, word: 'Búho', translation: 'Con cú', image: 'owl', category: 'Động vật' },
    { id: 2, word: 'Uva', translation: 'Quả nho', image: 'grape', category: 'Trái cây' },
    { id: 3, word: 'Dos', translation: 'Số hai', image: 'two', category: 'Số đếm' },
    { id: 4, word: 'Mariposa', translation: 'Con bướm', image: 'butterfly', category: 'Côn trùng' },
    { id: 5, word: 'Sol', translation: 'Mặt trời', image: 'sun', category: 'Thiên nhiên' },
  ];

  const current = vocabList[currentIndex];

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabList.length);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 800);
  };

  const prevWord = () => {
    setCurrentIndex((prev) => (prev === 0 ? vocabList.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-3">
        <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
          <X className="w-5 h-5 text-purple-700" />
        </button>
        <div className="text-center">
          <p className="text-xs font-medium text-purple-600 opacity-80">{current.category}</p>
          <h1 className="text-xl font-bold text-purple-800">Học Từ Vựng</h1>
        </div>
        <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition opacity-0">
          <RotateCcw className="w-5 h-5 text-purple-700" />
        </button>
      </div>

      {/* Progress */}
      <div className="relative z-10 px-6 mb-5">
        <div className="flex justify-between text-xs font-bold text-purple-700 mb-2">
          <span>{currentIndex + 1}</span>
          <span>{vocabList.length}</span>
        </div>
        <div className="w-full bg-white/60 backdrop-blur rounded-full h-3 shadow-inner overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${((currentIndex + 1) / vocabList.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shine"></div>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300 hover:scale-[1.02]">
          {/* Word */}
          <div className="text-center mb-6">
            <h2 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {current.word}
            </h2>
            <p className="text-2xl font-semibold text-gray-700 mt-3">{current.translation}</p>
          </div>

          {/* Image */}
          <div className="flex justify-center items-center h-64 mb-6">
            <div className="relative">
              <div className="w-56 h-56 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-inner p-4">
                <img
                  //src={require(`../../assets/vocab/${current.image}.png`)}
                  alt={current.word}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
              {showSuccess && (
                <div className="absolute -top-4 -right-4 animate-bounce">
                  <Sparkles className="w-10 h-10 text-yellow-500" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="w-14 h-14 rounded-2xl bg-white text-red-500 border-2 border-red-200 flex items-center justify-center shadow-lg hover:scale-110 transition">
              <Flag className="w-7 h-7" />
            </button>

            <button className="w-14 h-14 rounded-2xl bg-white text-pink-500 border-2 border-pink-200 flex items-center justify-center shadow-lg hover:scale-110 transition">
              <Heart className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation + Control Bar (THEO HÌNH) */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-t-3xl shadow-2xl p-5">
        <div className="flex justify-center items-center gap-6">
          {/* Nút trái */}
          <button
            onClick={prevWord}
            className="w-14 h-14 bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-7 h-7 text-purple-700" />
          </button>

          {/* Nút Tiếp tục lớn */}
          <button
            onClick={nextWord}
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </button>

          {/* Nút phải */}
          <button
            onClick={nextWord}
            className="w-14 h-14 bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-all"
          >
            <ChevronRight className="w-7 h-7 text-purple-700" />
          </button>
        </div>

        {/* Control Bar - CHỈ HIỂN THỊ, KHÔNG CHỨC NĂNG */}
        <div className="flex justify-center items-center gap-4 mt-5 px-8">
          {/* Voice */}
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-xl">
            <div className="w-5 h-5 bg-purple-600 rounded-full"></div>
            <span className="text-sm font-bold text-purple-700">Mateo</span>
            <ChevronDown className="w-4 h-4 text-purple-600" />
          </div>

          {/* Speed */}
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-xl">
            <span className="text-sm font-bold text-purple-700">x1</span>
            <ChevronDown className="w-4 h-4 text-purple-600" />
          </div>

          {/* Autoplay */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Autoplay</span>
            <div className="w-12 h-6 bg-purple-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-purple-600 font-medium bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow">
          Vuốt hoặc nhấn để tiếp tục
        </p>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </div>
  );
};

// Thêm icon ChevronDown nếu chưa có
const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default VocabularyLesson;