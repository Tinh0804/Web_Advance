// src/pages/Game/MatchingGame.jsx
import { Heart, Star, Trophy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import exerciseService from '../../services/exerciseService';

import correctAudio from '../../assets/audio/correct_answer.mp3';
import incorrectAudio from '../../assets/audio/wrong_answer.mp3';

const MatchingGame = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();

  // Audio refs
  const correctSound = useRef(null);
  const incorrectSound = useRef(null);

  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongPairs, setWrongPairs] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize audio
  useEffect(() => {
    correctSound.current = new Audio(correctAudio);
    incorrectSound.current = new Audio(incorrectAudio);
    correctSound.current.volume = 0.8;
    incorrectSound.current.volume = 0.8;
    correctSound.current.preload = 'auto';
    incorrectSound.current.preload = 'auto';
  }, []);

  // Load exercises từ API
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoading(true);
        const response = await exerciseService.getByUnit(unitId);
        
        const matchPairsExercises = response.data.filter(
          ex => ex.exerciseType === 'match_pairs'
        );

        if (matchPairsExercises.length === 0) {
          setError('Không tìm thấy bài tập ghép cặp cho unit này');
          return;
        }

        setExercises(matchPairsExercises);
        loadExercise(matchPairsExercises[0]);
      } catch (err) {
        console.error('Lỗi khi tải bài tập:', err);
        setError('Không thể tải bài tập. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [unitId]);

  // Parse và load một exercise - FIXED LOGIC
  const loadExercise = (exercise) => {
    console.log('📦 Exercise data:', exercise);
    console.log('📝 Options:', exercise.options);
    
    const parsedPairs = [];
    
    // Parse options với logic đúng
    exercise.options.forEach((option, index) => {
      console.log(`Option ${index}:`, option);
      const parts = option.split(',');
      console.log(`  Split parts:`, parts);
      
      if (parts.length === 2) {
        parsedPairs.push({
          english: parts[0].trim(),
          vietnamese: parts[1].trim()
        });
      }
    });

    console.log('✅ Parsed pairs:', parsedPairs);

    // Shuffle riêng cho mỗi cột - QUAN TRỌNG: giữ nguyên pairId tương ứng với index trong parsedPairs
    const shuffledLeft = [...parsedPairs]
      .map((p, i) => ({ id: `left-${i}`, text: p.english, pairId: i }))
      .sort(() => Math.random() - 0.5);
    
    const shuffledRight = [...parsedPairs]
      .map((p, i) => ({ id: `right-${i}`, text: p.vietnamese, pairId: i }))
      .sort(() => Math.random() - 0.5);

    console.log('🔀 Shuffled Left:', shuffledLeft);
    console.log('🔀 Shuffled Right:', shuffledRight);

    setPairs({
      left: shuffledLeft,
      right: shuffledRight,
      original: parsedPairs // Lưu cặp gốc để check
    });

    setMatchedPairs([]);
    setWrongPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Xử lý khi click vào item
  const handleSelect = (item, side) => {
    if (matchedPairs.some(pair => pair.left.id === item.id || pair.right.id === item.id)) {
      return;
    }

    if (side === 'left') {
      setSelectedLeft(item);
      if (selectedRight) {
        checkMatch(item, selectedRight);
      }
    } else {
      setSelectedRight(item);
      if (selectedLeft) {
        checkMatch(selectedLeft, item);
      }
    }
  };

  // Kiểm tra match - FIXED LOGIC
  const checkMatch = (leftItem, rightItem) => {
    console.log('🎯 Checking match:');
    console.log('  Left:', leftItem);
    console.log('  Right:', rightItem);
    console.log('  Left pairId:', leftItem.pairId);
    console.log('  Right pairId:', rightItem.pairId);
    
    // Kiểm tra xem 2 item có cùng pairId không
    const isCorrect = leftItem.pairId === rightItem.pairId;
    console.log('  Result:', isCorrect ? '✅ CORRECT' : '❌ WRONG');

    if (isCorrect) {
      setMatchedPairs(prev => [...prev, { left: leftItem, right: rightItem }]);
      setScore(prev => prev + 10);
      
      // Play correct sound
      if (correctSound.current) {
        correctSound.current.currentTime = 0;
        correctSound.current.play().catch(() => {});
      }
      
      if (matchedPairs.length + 1 === pairs.left.length) {
        setTimeout(() => {
          if (currentExerciseIndex + 1 < exercises.length) {
            setCurrentExerciseIndex(prev => prev + 1);
            loadExercise(exercises[currentExerciseIndex + 1]);
          } else {
            setIsCompleted(true);
          }
        }, 1000);
      }
    } else {
      setWrongPairs([{ left: leftItem, right: rightItem }]);
      setLives(prev => prev - 1);

      // Play incorrect sound
      if (incorrectSound.current) {
        incorrectSound.current.currentTime = 0;
        incorrectSound.current.play().catch(() => {});
      }

      if (lives - 1 <= 0) {
        setTimeout(() => {
          alert('Hết mạng! Bạn đã thua.');
          navigate('/practice');
        }, 500);
      }

      setTimeout(() => {
        setWrongPairs([]);
      }, 1000);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isSelected = (item, side) => {
    return (side === 'left' && selectedLeft?.id === item.id) ||
           (side === 'right' && selectedRight?.id === item.id);
  };

  const isMatched = (item) => {
    return matchedPairs.some(pair => pair.left.id === item.id || pair.right.id === item.id);
  };

  const isWrong = (item) => {
    return wrongPairs.some(pair => pair.left.id === item.id || pair.right.id === item.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-lg text-purple-700 font-bold">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-5">{error}</p>
          <button
            onClick={() => navigate('/practice')}
            className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Chúc mừng!</h2>
          <p className="text-lg text-gray-600 mb-5">
            Bạn đã hoàn thành tất cả bài tập ghép cặp!
          </p>
          <div className="flex justify-center gap-3 mb-6">
            <div className="bg-purple-100 px-5 py-2 rounded-xl">
              <Star className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-purple-700">{score}</p>
              <p className="text-xs text-purple-600">Điểm</p>
            </div>
            <div className="bg-green-100 px-5 py-2 rounded-xl">
              <Heart className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-green-700">{lives}</p>
              <p className="text-xs text-green-600">Mạng còn lại</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:scale-105 transition shadow-lg"
          >
            Về trang Practice
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-4 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/practice')}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
          >
            <X className="w-4 h-4 text-purple-700" />
          </button>

          <div className="flex-1 mx-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="font-bold text-red-500 text-sm">{lives}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Chọn cặp từ</h1>
          <p className="text-base text-purple-600">{currentExercise.question}</p>
          <div className="mt-3 inline-block bg-purple-100 px-4 py-1.5 rounded-full">
            <span className="text-purple-700 font-bold text-sm">
              Câu {currentExerciseIndex + 1}/{exercises.length} • Điểm: {score}
            </span>
          </div>
        </div>

        {/* Matching Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            {pairs.left?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item, 'left')}
                disabled={isMatched(item)}
                className={`w-full p-4 rounded-xl text-base font-semibold transition-all transform hover:scale-105 ${
                  isMatched(item)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed opacity-50'
                    : isWrong(item)
                    ? 'bg-red-100 text-red-700 border-2 border-red-400 animate-pulse'
                    : isSelected(item, 'left')
                    ? 'bg-purple-200 text-purple-800 border-2 border-purple-500 scale-105'
                    : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl mr-2">🅰️</span>
                  <span className="flex-1 text-center">{item.text}</span>
                  {isMatched(item) && <span className="text-xl">✓</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {pairs.right?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item, 'right')}
                disabled={isMatched(item)}
                className={`w-full p-4 rounded-xl text-base font-semibold transition-all transform hover:scale-105 ${
                  isMatched(item)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed opacity-50'
                    : isWrong(item)
                    ? 'bg-red-100 text-red-700 border-2 border-red-400 animate-pulse'
                    : isSelected(item, 'right')
                    ? 'bg-purple-200 text-purple-800 border-2 border-purple-500 scale-105'
                    : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  {isMatched(item) && <span className="text-xl">✓</span>}
                  <span className="flex-1 text-center">{item.text}</span>
                  <span className="text-xl ml-2">🅱️</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Đã ghép: <span className="font-bold text-purple-600">{matchedPairs.length}</span> / {pairs.left?.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;