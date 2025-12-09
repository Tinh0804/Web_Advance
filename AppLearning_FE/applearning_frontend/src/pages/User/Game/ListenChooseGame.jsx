// src/pages/Game/ListenChooseGame.jsx
import { Heart, Loader2, Sparkles, Trophy, Volume2, X } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import lessonService from "../../../services/lessonService";
import vocabularyService from "../../../services/vocabularyService";

import correctAudio from "../../../assets/audio/correct_answer.mp3";
import incorrectAudio from "../../../assets/audio/wrong_answer.mp3";

class ListenChooseGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      currentIndex: 0,
      selectedOption: null,
      showResult: false,
      isCorrect: false,
      lives: 5,
      score: 0,
      loading: true,
      error: null,
      totalExercises: 0,
      isPlaying: false,
    };

    this.correctSound = new Audio(correctAudio);
    this.incorrectSound = new Audio(incorrectAudio);
    this.correctSound.volume = this.incorrectSound.volume = 0.8;
    this.currentAudio = null;
  }

  componentDidMount() { this.loadData(); }
  componentDidUpdate(prevProps) {
    if (prevProps.params.unitId !== this.props.params.unitId) this.loadData();
  }

  componentWillUnmount() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  loadData = async () => {
    const { unitId } = this.props.params;
    try {
      this.setState({ loading: true, error: null });

      const lessons = await lessonService.getLessonsByUnitId(unitId);
      if (!lessons?.length) throw new Error("Không có bài học trong Unit này");

      const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
      const words = await vocabularyService.getWordsByLesson(randomLesson.lessonId);
      if (!words?.length || words.length < 4) throw new Error("Không đủ từ vựng");

      const exercises = words.map(word => {
        const wrong = words
          .filter(w => w.wordId !== word.wordId)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(w => w.wordName);

        const options = [word.wordName, ...wrong].sort(() => Math.random() - 0.5);

        return {
          id: word.wordId,
          audioFile: word.audioUrl || word.pronunciationUrl || "",
          correctAnswer: word.wordName,
          options,
        };
      });

      this.setState({
        exercises,
        totalExercises: exercises.length,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      this.setState({ error: err.message || "Lỗi tải dữ liệu", loading: false });
    }
  };

  playAudio = () => {
    const current = this.state.exercises[this.state.currentIndex];
    const url = current?.audioFile;
    
    if (!url) {
      // Fallback: sử dụng Web Speech API để đọc từ
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(current.correctAnswer);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        
        this.setState({ isPlaying: true });
        
        utterance.onend = () => {
          this.setState({ isPlaying: false });
        };
        
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    // Dừng audio hiện tại nếu có
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    this.setState({ isPlaying: true });
    
    this.currentAudio = new Audio(url);
    this.currentAudio.play().catch(() => {
      this.setState({ isPlaying: false });
    });

    this.currentAudio.onended = () => {
      this.setState({ isPlaying: false });
      this.currentAudio = null;
    };
  };

  handleOptionClick = (option) => {
    if (this.state.showResult) return;

    const correct = option === this.state.exercises[this.state.currentIndex].correctAnswer;

    this.setState({
      selectedOption: option,
      showResult: true,
      isCorrect: correct,
    });

    if (correct) {
      this.correctSound.currentTime = 0;
      this.correctSound.play();
      this.setState(p => ({ score: p.score + 10 }));
      setTimeout(() => this.next(), 1500);
    } else {
      this.incorrectSound.currentTime = 0;
      this.incorrectSound.play();
      this.setState(p => ({ lives: p.lives - 1 }), () => {
        if (this.state.lives <= 1) {
          setTimeout(() => {
            alert("Hết mạng rồi!");
            this.props.navigate("/practice");
          }, 1000);
        } else {
          setTimeout(() => this.setState({ selectedOption: null, showResult: false }), 2000);
        }
      });
    }
  };

  next = () => {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    this.setState(p => ({
      currentIndex: p.currentIndex + 1,
      selectedOption: null,
      showResult: false,
      isPlaying: false,
    }));
  };

  render() {
    const { navigate } = this.props;
    const { 
      exercises, currentIndex, selectedOption, showResult, isCorrect, 
      lives, score, loading, error, totalExercises, isPlaying 
    } = this.state;

    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-center">
          <Loader2 className="w-20 h-20 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Đang tải bài học...</p>
        </div>
      </div>
    );

    if (error) return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-8">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/practice")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition"
          >
            Quay lại Practice
          </button>
        </div>
      </div>
    );

    if (currentIndex >= exercises.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"></div>
            
            <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6 animate-bounce" />
            <Sparkles className="w-12 h-12 text-pink-500 absolute top-20 right-20 animate-pulse" />
            <Sparkles className="w-8 h-8 text-purple-500 absolute top-32 left-16 animate-pulse" />
            
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              XUẤT SẮC!
            </h1>
            <p className="text-xl text-gray-600 mb-8">Bạn đã hoàn thành tất cả câu hỏi</p>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl mb-8">
              <p className="text-lg text-gray-700 mb-2">Tổng điểm của bạn</p>
              <p className="text-7xl font-black text-purple-600">{score}</p>
              <p className="text-sm text-gray-600 mt-2">điểm</p>
            </div>
            
            <button
              onClick={() => navigate("/practice")}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:scale-105 transform transition shadow-lg"
            >
              ✨ Về trang Practice
            </button>
          </div>
        </div>
      );
    }

    const current = exercises[currentIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        {/* Header */}
        <div className="bg-white shadow-lg sticky top-0 z-10 p-3 border-b-4 border-purple-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <button 
              onClick={() => navigate("/practice")} 
              className="p-2 hover:bg-gray-100 rounded-xl transition group flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition" />
            </button>
            
            <div className="flex-1 min-w-0 mx-3">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-500 relative"
                  style={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-center mt-1 text-xs font-bold text-gray-700">
                Câu hỏi {currentIndex + 1}/{totalExercises}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 px-3 py-2 rounded-xl shadow-md border-2 border-orange-200">
                <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-lg font-black text-orange-600">{score}</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 rounded-xl shadow-md border-2 border-red-200">
                <Heart className="w-5 h-5 text-red-500 fill-red-500 flex-shrink-0" />
                <span className="text-lg font-black text-red-600">{lives}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Nghe và Chọn Từ Đúng
            </h1>
            <p className="text-base text-gray-600">Nhấn nút bên dưới để nghe phát âm</p>
          </div>

          {/* Audio Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={this.playAudio}
              disabled={isPlaying}
              className={`
                group relative px-10 py-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 
                text-white text-xl font-black rounded-3xl shadow-2xl 
                transform transition-all duration-300
                ${isPlaying 
                  ? 'scale-95 opacity-80 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-purple-500/50'
                }
              `}
            >
              <div className="absolute inset-0 bg-white opacity-20 rounded-3xl animate-pulse"></div>
              
              <div className="relative flex items-center justify-center gap-4">
                <Volume2 
                  size={50} 
                  className={`${isPlaying ? 'animate-bounce' : 'group-hover:animate-pulse'}`}
                />
                <div className="text-left">
                  <div className="text-2xl md:text-3xl font-black">
                    {isPlaying ? 'ĐANG PHÁT...' : 'NGHE ÂM THANH'}
                  </div>
                  <div className="text-xs md:text-sm font-normal opacity-90 mt-1">
                    {isPlaying ? 'Hãy lắng nghe kỹ' : 'Nhấn để nghe'}
                  </div>
                </div>
              </div>
              
              {/* Animated rings */}
              {isPlaying && (
                <>
                  <div className="absolute inset-0 rounded-3xl border-4 border-white opacity-75 animate-ping"></div>
                  <div className="absolute inset-0 rounded-3xl border-4 border-white opacity-50 animate-ping" style={{animationDelay: '0.3s'}}></div>
                </>
              )}
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {current.options.map((opt, i) => {
              const picked = selectedOption === opt;
              const right = opt === current.correctAnswer;

              return (
                <button
                  key={i}
                  onClick={() => this.handleOptionClick(opt)}
                  disabled={showResult}
                  className={`
                    relative py-6 px-6 text-xl md:text-2xl font-bold rounded-2xl border-4 
                    transition-all duration-300 transform overflow-hidden
                    ${showResult
                      ? picked
                        ? isCorrect
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-600 text-white scale-105 shadow-2xl shadow-emerald-500/50"
                          : "bg-gradient-to-br from-red-500 to-pink-600 border-red-600 text-white shake"
                        : right
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-600 text-white animate-pulse shadow-xl"
                          : "bg-gray-100 text-gray-400 border-gray-200 opacity-50"
                      : "bg-white border-purple-200 hover:border-purple-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-200 active:scale-95"
                    }
                  `}
                >
                  {/* Success confetti effect */}
                  {showResult && picked && isCorrect && (
                    <>
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <Sparkles className="absolute top-2 right-2 text-yellow-300 animate-ping w-6 h-6" />
                        <Sparkles className="absolute bottom-2 left-2 text-yellow-300 animate-ping w-4 h-4" style={{animationDelay: '0.2s'}} />
                        <Sparkles className="absolute top-1/2 left-1/2 text-yellow-300 animate-ping w-5 h-5" style={{animationDelay: '0.4s'}} />
                      </div>
                      {/* Firework effect */}
                      <div className="confetti-container">
                        {[...Array(20)].map((_, idx) => (
                          <div key={idx} className="confetti" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 0.3}s`,
                            backgroundColor: ['#FFD700', '#FF69B4', '#00FF00', '#FF4500', '#9370DB'][Math.floor(Math.random() * 5)]
                          }}></div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {showResult && (
                      <span className="text-3xl">
                        {picked && isCorrect && '✓'}
                        {picked && !isCorrect && '✗'}
                        {!picked && right && '✓'}
                      </span>
                    )}
                    <span className="break-words">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <div className="text-center mt-8 animate-fade-in">
              {isCorrect ? (
                <div className="inline-block bg-gradient-to-r from-emerald-100 to-green-100 px-8 py-4 rounded-3xl shadow-lg border-2 border-emerald-300">
                  <p className="text-2xl md:text-3xl font-black text-emerald-600">
                    🎉 Chính xác! +10 điểm
                  </p>
                </div>
              ) : (
                <div className="inline-block bg-gradient-to-r from-red-100 to-pink-100 px-8 py-4 rounded-3xl shadow-lg border-2 border-red-300">
                  <p className="text-xl md:text-2xl font-black text-red-600 mb-2">
                    ❌ Chưa đúng! -1 mạng
                  </p>
                  <p className="text-base md:text-lg text-gray-700">
                    Đáp án đúng: <span className="font-bold text-emerald-600">{current.correctAnswer}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .shake {
            animation: shake 0.4s ease-in-out;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          /* Confetti animation */
          .confetti-container {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
          }
          
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            top: 50%;
            animation: confetti-fall 1.5s ease-out forwards;
            opacity: 0;
          }
          
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-200px) translateX(var(--tx, 0)) rotate(720deg);
              opacity: 0;
            }
          }
          
          .confetti:nth-child(odd) {
            --tx: -100px;
          }
          
          .confetti:nth-child(even) {
            --tx: 100px;
          }
          
          .confetti:nth-child(3n) {
            --tx: 0px;
          }
          
          /* Celebration pulse */
          @keyframes celebrate {
            0%, 100% { 
              transform: scale(1);
            }
            50% { 
              transform: scale(1.1);
            }
          }
        `}</style>
      </div>
    );
  }
}

// Wrapper đúng chuẩn React Router v6
const ListenChooseGameWithRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  return <ListenChooseGame params={params} navigate={navigate} />;
};

export default ListenChooseGameWithRouter;