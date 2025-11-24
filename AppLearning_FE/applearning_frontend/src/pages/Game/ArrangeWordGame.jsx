// src/pages/Game/ArrangeWordGame.jsx
import { Award, Check, ChevronRight, Loader2, X } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import exerciseService from "../../services/exerciseService";


import correctAudio from "../../assets/audio/correct_answer.mp3";
import incorrectAudio from "../../assets/audio/wrong_answer.mp3";
import ArrangeIcon from "../../assets/icons/arrange.png";

class ArrangeWordGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      currentExerciseIndex: 0,
      selectedWords: [],
      availableWords: [],
      showResult: false,
      isCorrect: false,
      correctAnswer: "",
      experienceEarned: 0,
      loading: true,
      submitting: false,
      error: null,
      totalExercises: 0,
      completedExercises: 0,
    };

    // Dùng âm thanh thật
    this.correctSound = new Audio(correctAudio);
    this.incorrectSound = new Audio(incorrectAudio);
    this.correctSound.volume = 0.8;
    this.incorrectSound.volume = 0.8;
    this.correctSound.preload = "auto";
    this.incorrectSound.preload = "auto";
  }

  componentDidMount() {
    this.fetchExercises();
  }

  fetchExercises = async () => {
    const { unitId } = this.props.params;
    try {
      this.setState({ loading: true, error: null });
      const result = await exerciseService.getByUnit(unitId);

      if (result.status && result.data) {
        const wordOrderExercises = result.data.filter(
          (ex) => ex.exerciseType === "word_order"
        );

        if (wordOrderExercises.length > 0) {
          this.setState(
            {
              exercises: wordOrderExercises,
              totalExercises: wordOrderExercises.length,
              loading: false,
            },
            this.setupCurrentExercise
          );
        } else {
          this.setState({
            exercises: [
              {
                exerciseId: 999,
                lessonId: parseInt(unitId),
                exerciseType: "word_order",
                question: "Sắp xếp lại các từ để tạo thành câu đúng.",
                correctAnswer: "I love learning English.",
                experienceReward: 10,
              },
            ],
            totalExercises: 1,
            loading: false,
          }, this.setupCurrentExercise);
        }
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      this.setState({
        error: "Không tải được bài tập. Vui lòng thử lại.",
        loading: false,
      });
    }
  };

  setupCurrentExercise = () => {
    const { exercises, currentExerciseIndex } = this.state;
    if (currentExerciseIndex >= exercises.length) return;

    const currentExercise = exercises[currentExerciseIndex];
    const words = currentExercise.correctAnswer.split(" ");
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    this.setState({
      availableWords: shuffledWords,
      selectedWords: [],
      showResult: false,
      isCorrect: false,
      correctAnswer: currentExercise.correctAnswer,
    });
  };

  handleWordClick = (word, index, isSelected) => {
    if (this.state.showResult || this.state.submitting) return;

    if (isSelected) {
      this.setState((prev) => ({
        selectedWords: prev.selectedWords.filter((_, i) => i !== index),
      }));
    } else {
      this.setState((prev) => ({
        selectedWords: [...prev.selectedWords, word],
      }));
    }
  };

  checkAnswer = async () => {
    const { exercises, currentExerciseIndex, selectedWords } = this.state;
    const currentExercise = exercises[currentExerciseIndex];
    const userAnswer = selectedWords.join(" ").trim();

    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).userId : 1;

    try {
      this.setState({ submitting: true });

      const result = await exerciseService.submit({
        exerciseId: currentExercise.exerciseId,
        userId: userId,
        userAnswer: userAnswer,
      });

      if (result.status && result.data) {
        const isCorrect = result.data.isCorrect;

        this.setState({
          showResult: true,
          isCorrect,
          experienceEarned: result.data.experienceEarned || 10,
          submitting: false,
        });

        if (isCorrect) {
          this.correctSound.currentTime = 0;
          this.correctSound.play().catch(() => {});
          setTimeout(this.nextExercise, 2000);
        } else {
          this.incorrectSound.currentTime = 0;
          this.incorrectSound.play().catch(() => {});
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      this.setState({ submitting: false });
    }
  };

  nextExercise = () => {
    const { currentExerciseIndex, exercises } = this.state;

    if (currentExerciseIndex < exercises.length - 1) {
      this.setState(
        (prev) => ({
          currentExerciseIndex: prev.currentExerciseIndex + 1,
          completedExercises: prev.completedExercises + 1,
          showResult: false,
        }),
        this.setupCurrentExercise
      );
    } else {
      alert("Hoàn thành tất cả bài tập! Chúc mừng bạn!");
      this.props.navigate("/practice");
    }
  };

  skipExercise = () => this.nextExercise();

  render() {
    const { navigate } = this.props;
    const {
      exercises,
      currentExerciseIndex,
      selectedWords,
      availableWords,
      showResult,
      isCorrect,
      correctAnswer,
      experienceEarned,
      loading,
      submitting,
      error,
      totalExercises,
      completedExercises,
    } = this.state;

    // ĐÃ SỬA LỖI: thêm dấu ) và </p> đầy đủ
    if (loading) {
      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Đang tải bài tập...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi rồi mẹ ơi!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/practice")}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }

    const currentExercise = exercises[currentExerciseIndex];
    const remainingWords = availableWords.filter((w) => !selectedWords.includes(w));
    const progress = ((completedExercises + (showResult && isCorrect ? 1 : 0)) / totalExercises) * 100;

    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/practice")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex-1">
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                {completedExercises + 1}/{totalExercises}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={ArrangeIcon} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentExercise.question}</h2>
                <p className="text-gray-500">Chạm vào từ để sắp xếp thành câu đúng</p>
              </div>
            </div>

            <div className="min-h-32 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 mb-8">
              {selectedWords.length === 0 ? (
                <p className="text-center text-gray-400 text-lg h-full flex items-center justify-center">
                  Chạm vào từ bên dưới để bắt đầu
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {selectedWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => this.handleWordClick(word, i, true)}
                      disabled={submitting}
                      className="group relative px-6 py-4 bg-white border-2 border-blue-400 rounded-xl text-lg font-semibold text-gray-800 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-md active:scale-95"
                    >
                      {word}
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {remainingWords.map((word, i) => (
                <button
                  key={i}
                  onClick={() => this.handleWordClick(word, i, false)}
                  disabled={submitting}
                  className="px-6 py-4 bg-white border-2 border-gray-300 rounded-xl text-lg font-semibold text-gray-700 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className={`rounded-3xl p-10 mb-8 shadow-2xl border-2 relative overflow-hidden ${isCorrect ? "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300" : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"}`}>
              {isCorrect && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className="absolute text-yellow-400 text-3xl animate-ping" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}>
                      Well done
                    </div>
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-yellow-300/30 rounded-full animate-ping"></div>
                    <div className="w-32 h-32 bg-yellow-300/40 rounded-full animate-ping absolute animation-delay-200"></div>
                    <div className="text-9xl animate-bounce">Perfect</div>
                  </div>
                </div>
              )}

              <div className="relative z-10 flex items-center gap-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                  {isCorrect ? <Check className="w-12 h-12 text-white animate-pulse" /> : <X className="w-12 h-12 text-white" />}
                </div>

                <div className="flex-1">
                  {isCorrect ? (
                    <div>
                      <h3 className="text-5xl font-black text-green-700 mb-2">TUYỆT VỜI!</h3>
                      <p className="text-2xl text-green-600 font-bold">Bạn đã sắp xếp hoàn hảo!</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-5xl font-black text-red-700 mb-3">Sai rồi!</h3>
                      <p className="text-xl text-red-600 mb-2">Đáp án đúng là:</p>
                      <p className="text-3xl font-bold text-red-800 bg-white/80 px-8 py-4 rounded-2xl inline-block shadow-xl">
                        {correctAnswer}
                      </p>
                    </div>
                  )}
                </div>

                {isCorrect && (
                  <div className="text-right">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-5 rounded-full shadow-2xl animate-bounce">
                      <Award className="w-10 h-10" />
                      <span className="text-4xl font-black">+{experienceEarned}</span>
                    </div>
                    <div className="text-5xl font-black text-yellow-400 animate-ping mt-2">+{experienceEarned}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nút */}
          <div className="flex gap-4">
            <button onClick={this.skipExercise} disabled={submitting} className="flex-1 py-5 px-6 bg-white border-2 border-gray-300 rounded-2xl text-gray-700 font-bold text-xl hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50">
              BỎ QUA
            </button>
            <button
              onClick={this.checkAnswer}
              disabled={selectedWords.length === 0 || submitting || showResult}
              className={`flex-1 py-5 px-6 rounded-2xl font-black text-xl text-white transition-all flex items-center justify-center gap-3 ${
                selectedWords.length === 0 || submitting || showResult
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl active:scale-95"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  KIỂM TRA
                  <ChevronRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const ArrangeWordGameWithRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  return <ArrangeWordGame params={params} navigate={navigate} />;
};

export default ArrangeWordGameWithRouter;