// src/pages/VocabularyLearn.jsx
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronLeft, ChevronRight,
  Flag,
  Heart,
  RotateCcw, Sparkles,
  Star,
  Volume2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import wordService from '../../../services/wordService';

const VocabularyLearn = () => {
  // Lấy lessonId từ URL params
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy thông tin bổ sung từ state (nếu có)
  const { lessonName, unitName } = location.state || {};

  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [flagged, setFlagged] = useState(new Set());
  const [learned, setLearned] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadWords = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const words = await wordService.getWordsByLessonId(lessonId);

        if (words.length === 0) {
          setError("Bài học này chưa có từ vựng nào.");
        } else {
          setVocabList(words);
        }
      } catch (err) {
        console.error("Lỗi khi tải từ vựng:", err);
        const msg = err.message || "Không thể tải dữ liệu bài học";
        setError(msg.includes("hết hạn") ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." : msg);
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      loadWords();
    }
  }, [lessonId]);

  // Loading
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700 mb-6"></div>
          <p className="text-xl font-bold text-purple-700">Đang tải từ vựng...</p>
        </div>
      </div>
    );
  }

  // Lỗi
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-20 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl text-center max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không thể tải bài học</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition shadow-lg">
              Thử lại
            </button>
            <button onClick={() => navigate(-1)} className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition">
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = vocabList[currentIndex];

  const playSound = () => {
    if (current.audioFile) {
      const audio = new Audio(current.audioFile);
      audio.play().catch(() => {});
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(current.wordName);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextWord = () => {
    if (currentIndex < vocabList.length - 1) {
      setCurrentIndex(i => i + 1);
      setIsFlipped(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 600);
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setIsFlipped(false);
    }
  };

  const toggleFavorite = () => {
    setFavorites(prev => {
      const copy = new Set(prev);
      copy.has(current.wordId) ? copy.delete(current.wordId) : copy.add(current.wordId);
      return copy;
    });
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const copy = new Set(prev);
      copy.has(current.wordId) ? copy.delete(current.wordId) : copy.add(current.wordId);
      return copy;
    });
  };

  const markAsLearned = () => {
    setLearned(prev => new Set(prev).add(current.wordId));
    nextWord();
  };

  const resetProgress = () => {
    if (window.confirm("Đặt lại toàn bộ tiến độ bài học này?")) {
      setCurrentIndex(0);
      setLearned(new Set());
      setIsFlipped(false);
    }
  };

  const progressPercent = vocabList.length > 0 ? (learned.size / vocabList.length) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col relative overflow-x-hidden pb-24">

      {/* Glow background */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-full p-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition active:scale-95">
          <X className="w-5 h-5 text-purple-700" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-purple-800 flex items-center gap-2 justify-center">
            <BookOpen className="w-6 h-6" /> 
            {lessonName || 'Học Từ Vựng'}
          </h1>
          <p className="text-xs text-purple-600 mt-1">
            {unitName ? `${unitName} - Bài ${lessonId}` : `Bài ${lessonId}`}
          </p>
        </div>
        <button onClick={resetProgress} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition active:scale-95">
          <RotateCcw className="w-5 h-5 text-purple-700" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-purple-800">
                Đã học: {learned.size}/{vocabList.length}
              </span>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Heart className={`w-4 h-4 ${favorites.size > 0 ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
                <span>{favorites.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flag className={`w-4 h-4 ${flagged.size > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                <span>{flagged.size}</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="text-center mb-5 text-sm font-bold text-purple-700 bg-white/60 px-4 py-1 rounded-full inline-block mx-auto">
        Từ {currentIndex + 1} / {vocabList.length}
      </div>

      {/* Flashcard */}
      <div className="flex items-center justify-center px-6 py-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 cursor-pointer transition hover:scale-[1.02]" onClick={() => setIsFlipped(!isFlipped)}>
          
          {/* Front */}
          {!isFlipped ? (
            <>
              <div className="text-center">
                {learned.has(current.wordId) && (
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    <CheckCircle className="w-4 h-4 inline" /> Đã học
                  </span>
                )}
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                  {current.wordName}
                </h2>

                <button onClick={e => { e.stopPropagation(); playSound(); }} className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition shadow-lg hover:scale-110 active:scale-95">
                  <Volume2 className="w-8 h-8 text-white" />
                </button>

                <p className="text-lg text-gray-500 italic mt-6">{current.pronunciation || '—'}</p>
              </div>

              <div className="flex justify-center my-8">
                <div className="w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden shadow-inner">
                  <img src={current.imageUrl} alt={current.wordName} className="w-full h-full object-cover" />
                </div>
              </div>

              <p className="text-center text-purple-600 font-medium">Nhấn để xem nghĩa</p>
            </>
          ) : (
            <>
              <div className="text-center min-h-[420px] flex flex-col justify-center">
                <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-purple-800 mb-4">{current.wordName}</h2>
                <p className="text-3xl font-bold text-pink-600 mb-6">{current.translation}</p>
                <p className="text-lg text-gray-500 italic mb-8">{current.pronunciation || '—'}</p>

                {current.exampleSentence && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-2xl text-sm text-gray-700 italic">
                    "{current.exampleSentence}"
                  </div>
                )}

                <button onClick={e => { e.stopPropagation(); playSound(); }} className="mx-auto mt-6 p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full hover:from-purple-500 hover:to-pink-500 transition shadow-md hover:scale-110">
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              </div>
              <p className="text-center text-purple-600 font-medium mt-8">Nhấn để quay lại</p>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-10">
            <button onClick={e => { e.stopPropagation(); toggleFlag(); }} className={`p-4 rounded-2xl shadow-lg transition hover:scale-110 ${flagged.has(current.wordId) ? 'bg-red-500 text-white' : 'bg-white text-red-500 border-2 border-red-200'}`}>
              <Flag className="w-7 h-7" />
            </button>
            <button onClick={e => { e.stopPropagation(); toggleFavorite(); }} className={`p-4 rounded-2xl shadow-lg transition hover:scale-110 ${favorites.has(current.wordId) ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border-2 border-pink-200'}`}>
              <Heart className={`w-7 h-7 ${favorites.has(current.wordId) ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md rounded-t-3xl p-6 shadow-2xl border-t border-purple-100">
        <div className="flex justify-center items-center gap-10 max-w-lg mx-auto">
          <button onClick={prevWord} disabled={currentIndex === 0} className={`w-14 h-14 rounded-2xl shadow-lg transition ${currentIndex === 0 ? 'bg-gray-200 opacity-50' : 'bg-purple-200 hover:bg-purple-300 active:scale-95'}`}>
            <ChevronLeft className="w-8 h-8 text-purple-700 mx-auto" />
          </button>

          <button onClick={markAsLearned} className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition">
            <CheckCircle className="w-10 h-10 text-white mx-auto" />
          </button>

          <button onClick={nextWord} disabled={currentIndex === vocabList.length - 1} className={`w-14 h-14 rounded-2xl shadow-lg transition ${currentIndex === vocabList.length - 1 ? 'bg-gray-200 opacity-50' : 'bg-purple-200 hover:bg-purple-300 active:scale-95'}`}>
            <ChevronRight className="w-8 h-8 text-purple-700 mx-auto" />
          </button>
        </div>
        <p className="text-center mt-3 text-xs text-gray-600">Nhấn nút giữa để đánh dấu đã học</p>
      </div>

    </div>
  );
};

export default VocabularyLearn;