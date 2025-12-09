// src/pages/Game/MatchingGame.jsx
import { Heart, Star, Trophy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import exerciseService from '../../../services/exerciseService';

import correctAudio from '../../../assets/audio/correct_answer.mp3';
import incorrectAudio from '../../../assets/audio/wrong_answer.mp3';

import GameHeader from '../../../components/game/GameHeader';
import { useGame } from '../../../context/GameContext';

const MatchingGame = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();

  const { hearts, deductHeart, loading: isHeartsLoading } = useGame();

  const correctSound = useRef(null);
  const incorrectSound = useRef(null);

  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongPairs, setWrongPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    correctSound.current = new Audio(correctAudio);
    incorrectSound.current = new Audio(incorrectAudio);
    correctSound.current.volume = 0.8;
    incorrectSound.current.volume = 0.8;
    correctSound.current.preload = 'auto';
    incorrectSound.current.preload = 'auto';
  }, []);

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
    
    // Parse từng option - mỗi option là 1 cặp hoàn chỉnh "Vietnamese,English"
    exercise.options.forEach((option, index) => {
      console.log(`Option ${index}:`, option);
      const parts = option.split(',');
      console.log(`  Split parts:`, parts);
      
      // Giả định option có định dạng "Vietnamese,English"
      if (parts.length === 2) {
        parsedPairs.push({
          vietnamese: parts[0].trim(), // Cột trái
          english: parts[1].trim()     // Cột phải
        });
      }
    });

    console.log('Parsed pairs:', parsedPairs);

    // Shuffle riêng cho mỗi cột
    const shuffledLeft = [...parsedPairs]
      .map((p, i) => ({ 
        id: `left-${i}`, 
        text: p.vietnamese,  
        pairId: i 
      }))
      .sort(() => Math.random() - 0.5);
    
    const shuffledRight = [...parsedPairs]
      .map((p, i) => ({ 
        id: `right-${i}`, 
        text: p.english,  
        pairId: i 
      }))
      .sort(() => Math.random() - 0.5);

    console.log('🔀 Shuffled Left:', shuffledLeft);
    console.log('🔀 Shuffled Right:', shuffledRight);

    setPairs({
      left: shuffledLeft,
      right: shuffledRight
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

  // Kiểm tra match - CẬP NHẬT LOGIC TRỪ TIM
  const checkMatch = async (leftItem, rightItem) => {
    console.log('🎯 Checking match:');
    console.log('  Left:', leftItem);
    console.log('  Right:', rightItem);
    
    // Kiểm tra xem 2 item có cùng pairId không
    const isCorrect = leftItem.pairId === rightItem.pairId;

    if (isCorrect) {
      setMatchedPairs(prev => [...prev, { left: leftItem, right: rightItem }]);
      setScore(prev => prev + 10);
      
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
      
      // 💡 GỌI HÀM DEDUCT HEART TỪ CONTEXT
      const newHearts = await deductHeart();

      if (incorrectSound.current) {
        incorrectSound.current.currentTime = 0;
        incorrectSound.current.play().catch(() => {});
      }

      // 💡 KIỂM TRA MẠNG CÒN LẠI
      if (newHearts <= 0) {
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/practice')}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Chúc mừng!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Bạn đã hoàn thành tất cả bài tập ghép cặp!
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-yellow-50 px-6 py-3 rounded-xl">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{score}</p>
              <p className="text-sm text-gray-600">Điểm</p>
            </div>
            {/* 💡 HIỂN THỊ HEARTS TỪ CONTEXT */}
            <div className="bg-red-50 px-6 py-3 rounded-xl">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{isHeartsLoading ? '...' : hearts}</p>
              <p className="text-sm text-gray-600">Mạng còn lại</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
          >
            Về trang Practice
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const progressPercent = exercises.length > 0 
    ? ((currentExerciseIndex + 1) / exercises.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-white">
      
      {/* 💡 SỬ DỤNG GAMEHEADER */}
      <GameHeader
        progress={progressPercent}
        onBack={() => navigate('/practice')}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chọn cặp từ</h1>
        </div>

        {/* Matching Grid - NO NUMBERS */}
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Left Column - Vietnamese (Giả định cột trái là Vietnamese) */}
          <div className="space-y-3">
            {pairs.left?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item, 'left')}
                disabled={isMatched(item)}
                className={`
                  w-full px-6 py-4 rounded-2xl font-medium text-lg
                  border-2 transition-all
                  ${isMatched(item)
                    ? 'bg-green-50 border-green-200 text-green-600 cursor-not-allowed opacity-60'
                    : isWrong(item)
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : isSelected(item, 'left')
                    ? 'bg-blue-50 border-blue-400 text-blue-700 scale-[1.02]'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {item.text}
              </button>
            ))}
          </div>

          {/* Right Column - English (Giả định cột phải là English) */}
          <div className="space-y-3">
            {pairs.right?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item, 'right')}
                disabled={isMatched(item)}
                className={`
                  w-full px-6 py-4 rounded-2xl font-medium text-lg
                  border-2 transition-all
                  ${isMatched(item)
                    ? 'bg-green-50 border-green-200 text-green-600 cursor-not-allowed opacity-60'
                    : isWrong(item)
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : isSelected(item, 'right')
                    ? 'bg-blue-50 border-blue-400 text-blue-700 scale-[1.02]'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Đã ghép: <span className="font-bold text-blue-600">{matchedPairs.length}</span> / {pairs.left?.length}
          </p>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex justify-between">
          <button 
            onClick={() => {
              if (currentExerciseIndex + 1 < exercises.length) {
                setCurrentExerciseIndex(prev => prev + 1);
                loadExercise(exercises[currentExerciseIndex + 1]);
              } else {
                setIsCompleted(true);
              }
            }}
            className="px-8 py-3 text-blue-500 font-bold hover:bg-blue-50 rounded-xl transition"
          >
            BỎ QUA
          </button>
          <button className="px-8 py-3 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed">
            KIỂM TRA
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchingGame;