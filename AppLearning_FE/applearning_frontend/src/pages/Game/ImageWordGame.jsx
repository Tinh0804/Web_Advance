import { Heart, Trophy, Volume2, X, Star, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import exerciseService from "../../services/exerciseService";

import correctAudio from "../../assets/audio/correct_answer.mp3";
import incorrectAudio from "../../assets/audio/wrong_answer.mp3";

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
    };

    this.correctSound = new Audio(correctAudio);
    this.incorrectSound = new Audio(incorrectAudio);
    this.correctSound.volume = 0.8;
    this.incorrectSound.volume = 0.8;
  }

  componentDidMount() {
    this.loadExercises();
  }

  loadExercises = async () => {
    const { unitId } = this.props.params;

    try {
      this.setState({ loading: true, error: null });

      const response = await exerciseService.getByUnit(unitId);

      // Backend trả về ARRAY
      const allExercises = response || [];

      const listenExercises = allExercises.filter(
        (ex) => ex.exerciseType === "listen" && ex.audioFile && ex.options?.length >= 2
      );

      if (listenExercises.length === 0) {
        this.setState({
          error: "Không có bài tập nghe nào trong Unit này",
          loading: false,
        });
        return;
      }

      this.setState({
        exercises: listenExercises,
        totalExercises: listenExercises.length,
        loading: false,
      });
    } catch (err) {
      console.error("Lỗi tải bài nghe:", err);
      this.setState({
        error: "Không thể kết nối server",
        loading: false,
      });
    }
  };

  playAudio = () => {
    const current = this.state.exercises[this.state.currentIndex];
    if (current?.audioFile) {
      const audio = new Audio(current.audioFile);
      audio.play().catch(() => {});
    }
  };

  handleOptionClick = (option) => {
    if (this.state.showResult) return;

    const current = this.state.exercises[this.state.currentIndex];
    const correct = option === current.correctAnswer;

    this.setState({
      selectedOption: option,
      showResult: true,
      isCorrect: correct,
    });

    if (correct) {
      this.correctSound.currentTime = 0;
      this.correctSound.play();
      this.setState((prev) => ({ score: prev.score + 10 }));

      setTimeout(() => this.nextQuestion(), 1500);
    } else {
      this.incorrectSound.currentTime = 0;
      this.incorrectSound.play();

      this.setState((prev) => ({ lives: prev.lives - 1 }), () => {
        if (this.state.lives <= 1) {
          setTimeout(() => {
            alert("Hết mạng! Game Over");
            this.props.navigate("/practice");
          }, 1000);
        } else {
          setTimeout(() => {
            this.setState({ selectedOption: null, showResult: false });
          }, 2000);
        }
      });
    }
  };

  nextQuestion = () => {
    this.setState((prev) => {
      if (prev.currentIndex >= prev.exercises.length - 1) {
        return { currentIndex: prev.currentIndex + 1 };
      }
      return {
        currentIndex: prev.currentIndex + 1,
        selectedOption: null,
        showResult: false,
      };
    });
  };

  render() {
    const { navigate } = this.props;
    const {
      exercises,
      currentIndex,
      selectedOption,
      showResult,
      isCorrect,
      lives,
      score,
      loading,
      error,
      totalExercises,
    } = this.state;

    // Loading
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-purple-600 mb-4" />
            <p className="text-xl">Đang tải bài nghe...</p>
          </div>
        </div>
      );
    }

    // Error
    if (error) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <p className="text-2xl text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/practice")}
              className="px-8 py-4 bg-red-500 text-white rounded-xl font-bold"
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }

    // Completed
    if (currentIndex >= exercises.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md">
            <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-8 animate-bounce" />
            <h1 className="text-5xl font-bold mb-6">HOÀN THÀNH!</h1>
            <div className="space-y-6">
              <div className="bg-yellow-100 py-6 rounded-2xl">
                <Star className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                <p className="text-4xl font-bold">{score} điểm</p>
              </div>
              <div className="bg-red-100 py-6 rounded-2xl">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-2 fill-current" />
                <p className="text-4xl font-bold">{lives} mạng</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/practice")}
              className="mt-10 w-full py-5 bg-gradient-to-r from-green-500 to-teal-600 text-white text-2xl font-bold rounded-2xl"
            >
              Về trang Practice
            </button>
          </div>
        </div>
      );
    }

    const current = exercises[currentIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-lg sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <button onClick={() => navigate("/practice")} className="p-3 hover:bg-gray-100 rounded-xl">
              <X className="w-8 h-8" />
            </button>

            <div className="flex-1 mx-8">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
                />
              </div>
              <p className="text-center mt-2 text-lg font-medium text-gray-700">
                {currentIndex + 1} / {totalExercises}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-2xl">
              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              <span className="text-3xl font-bold text-red-600">{lives}</span>
            </div>
          </div>
        </div>

        {/* Main game */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-12">
            Nghe và chọn từ đúng
          </h1>

          <button
            onClick={this.playAudio}
            className="mx-auto mb-16 px-20 py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl font-bold rounded-full shadow-2xl hover:scale-105 transition transform flex items-center gap-6"
          >
            <Volume2 size={60} />
            NGHE ÂM THANH
          </button>

          <div className="grid grid-cols-2 gap-10 max-w-3xl mx-auto">
            {current.options.map((opt, i) => {
              const isPicked = selectedOption === opt;
              const isRight = opt === current.correctAnswer;

              return (
                <button
                  key={i}
                  onClick={() => this.handleOptionClick(opt)}
                  disabled={showResult}
                  className={`
                    py-12 text-3xl font-bold rounded-3xl border-4 transition-all duration-300 transform
                    ${
                      showResult
                        ? isPicked
                          ? isCorrect
                            ? "bg-green-500 border-green-600 text-white scale-110 shadow-2xl"
                            : "bg-red-500 border-red-600 text-white"
                          : isRight
                          ? "bg-green-500 border-green-600 text-white animate-pulse"
                          : "bg-gray-100 text-gray-400"
                        : "bg-white border-gray-300 hover:border-purple-600 hover:scale-105 hover:shadow-2xl"
                    }
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-16 text-4xl font-bold text-purple-700">
            Điểm: <span className="text-6xl text-orange-600">{score}</span>
          </div>
        </div>
      </div>
    );
  }
}

const ListenChooseGameWithRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  return <ListenChooseGame params={params} navigate={navigate} />;
};

export default ListenChooseGameWithRouter;
