import { ArrowLeft, Heart } from 'lucide-react';
import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import lessonService from "../../../services/lessonService";
import vocabularyService from '../../../services/vocabularyService';

// Âm thanh
import correctAudio from "../../../assets/audio/correct_answer.mp3";
import incorrectAudio from "../../../assets/audio/wrong_answer.mp3";

class PictureVocabularyGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      gameItems: [],
      selectedImage: null,
      selectedWord: null,
      matchedPairs: [],
      hearts: 5,
      progress: 0,
      loading: true,
      showResult: false,
      error: null
    };

    // Setup âm thanh
    this.correctSound = new Audio(correctAudio);
    this.incorrectSound = new Audio(incorrectAudio);
    this.correctSound.volume = 0.8;
    this.incorrectSound.volume = 0.8;
  }

  componentDidMount() {
    this.fetchWords();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.unitId !== this.props.params.unitId) {
      this.fetchWords();
    }
  }



  fetchWords = async () => {
    const { unitId } = this.props.params;

    try {
      this.setState({ loading: true, error: null });

      // 1. Lấy danh sách bài học của Unit
      const lessons = await lessonService.getLessonsByUnitId(unitId);

      if (!lessons || lessons.length === 0) {
        throw new Error("Unit này chưa có bài học nào.");
      }

      // 2. Random 1 bài học
      const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];

      // 3. Lấy từ vựng theo bài học đó
      const words = await vocabularyService.getWordsByLesson(randomLesson.lessonId);

      if (!words || words.length === 0) {
        throw new Error("Bài học này chưa có từ vựng.");
      }

      // 4. Shuffle và lấy 6 từ
      const shuffled = words.sort(() => Math.random() - 0.5);
      const selectedWords = shuffled.slice(0, Math.min(6, shuffled.length));

      this.setState({
        words: selectedWords,
        selectedLesson: randomLesson,
      });

      this.initializeGame(selectedWords);

    } catch (error) {
      console.error("Error:", error);
      this.setState({
        error: error.message || "Không thể tải dữ liệu.",
        loading: false
      });
    }
  };


  initializeGame = (list) => {
    const images = list.map(w => ({
      id: `img-${w.wordId}`,
      wordId: w.wordId,
      type: "image",
      content: w.imageUrl,
      matched: false,
    }));

    const words = list.map(w => ({
      id: `word-${w.wordId}`,
      wordId: w.wordId,
      type: "word",
      content: w.wordName,
      matched: false,
    }));

    const gameItems = [...images, ...words].sort(() => Math.random() - 0.5);

    this.setState({
      gameItems,
      selectedImage: null,
      selectedWord: null,
      matchedPairs: [],
      hearts: 5,
      progress: 0,
      showResult: false,
      loading: false
    });
  };

  handleItemClick = (item) => {
    const { selectedImage, selectedWord, matchedPairs } = this.state;

    if (item.matched || matchedPairs.includes(item.wordId)) return;

    if (item.type === "image") {
      this.setState({ selectedImage: item });

      if (selectedWord) this.checkMatch(item, selectedWord);
    } else {
      this.setState({ selectedWord: item });

      if (selectedImage) this.checkMatch(selectedImage, item);
    }
  };

  checkMatch = (image, word) => {
    const { matchedPairs, hearts } = this.state;

    if (image.wordId === word.wordId) {
      // Play sound đúng
      try {
        this.correctSound.currentTime = 0;
        this.correctSound.play().catch(() => { });
      } catch { }

      const newPairs = [...matchedPairs, image.wordId];

      this.setState(prev => ({
        matchedPairs: newPairs,
        gameItems: prev.gameItems.map(i =>
          i.wordId === image.wordId ? { ...i, matched: true } : i
        ),
        progress: Math.min(100, prev.progress + (100 / 6)),
      }));

      setTimeout(() => {
        this.setState({
          selectedImage: null,
          selectedWord: null,
        });

        if (newPairs.length === 6) this.handleGameComplete(true);
      }, 500);

    } else {
      // Play sound sai
      try {
        this.incorrectSound.currentTime = 0;
        this.incorrectSound.play().catch(() => { });
      } catch { }

      const newHearts = Math.max(0, hearts - 1);
      this.setState({ hearts: newHearts });

      setTimeout(() => {
        this.setState({
          selectedImage: null,
          selectedWord: null,
        });

        if (newHearts === 0) this.handleGameComplete(false);
      }, 800);
    }
  };

  handleGameComplete = async (isWin) => {
    const { unitId } = this.props.params;
    const { matchedPairs, hearts } = this.state;

    this.setState({ showResult: true });

    try {
      const data = {
        lessonId: parseInt(unitId),
        exerciseType: "picture",
        score: isWin ? 100 : Math.round((matchedPairs.length / 6) * 100),
        correctAnswers: matchedPairs.length,
        totalQuestions: 6,
        heartsRemaining: hearts,
        completedAt: new Date().toISOString(),
      };

      await vocabularyService.saveExerciseResult(data);
    } catch { }
  };

  resetGame = () => {
    this.initializeGame(this.state.words);
  };

  goBack = () => {
    this.props.navigate(-1);
  };

  retryFetch = () => {
    this.setState({ error: null });
    this.fetchWords();
  };

  render() {
    const { unitId } = this.props.params;
    const {
      loading, error, showResult,
      gameItems, selectedImage, selectedWord,
      matchedPairs, hearts, progress
    } = this.state;

    // Loading UI
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin h-14 w-14 border-t-4 border-indigo-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 text-lg">Đang tải...</p>
          </div>
        </div>
      );
    }

    // Error UI
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-2">⚠️</div>
            <h2 className="text-xl font-bold text-red-600 mb-3">Lỗi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={this.retryFetch}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    // Result UI
    if (showResult) {
      const isWin = matchedPairs.length === 6;
      const score = Math.round((matchedPairs.length / 6) * 100);

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md text-center">
            <div className="text-6xl mb-4">{isWin ? "🎉" : "😢"}</div>
            <h2 className={`text-3xl font-bold ${isWin ? "text-green-600" : "text-red-600"}`}>
              {isWin ? "Tuyệt vời!" : "Thua mất rồi!"}
            </h2>

            <p className="text-gray-600 mt-2 mb-6">
              {isWin
                ? `Bạn đã ghép đúng tất cả với ${hearts} ❤️`
                : `Số cặp đúng: ${matchedPairs.length}/6`}
            </p>

            <div className="p-4 bg-gray-100 rounded-xl mb-6">
              <p className="text-gray-500 text-sm">Điểm số</p>
              <p className="text-4xl font-bold text-indigo-600">{score}%</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={this.goBack}
                className="flex-1 py-3 bg-gray-200 rounded-xl font-semibold text-gray-700"
              >
                Thoát
              </button>
              <button
                onClick={this.resetGame}
                className="flex-1 py-3 bg-indigo-600 rounded-xl font-semibold text-white"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Game UI
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-md mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={this.goBack} className="p-2 hover:bg-gray-200 rounded-lg">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center bg-white px-3 py-2 rounded-full shadow">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="ml-1 font-semibold text-red-500">{hearts}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-800 mb-4">Chọn hình và từ tương ứng</h1>

          {/* Game Grid */}
          <div className="grid grid-cols-3 gap-5">
            {gameItems.map(item => {
              const isSelected =
                (item.type === "image" && selectedImage?.id === item.id) ||
                (item.type === "word" && selectedWord?.id === item.id);

              const isMatched = item.matched;

              return (
                <button
                  key={item.id}
                  onClick={() => this.handleItemClick(item)}
                  disabled={isMatched}
                  className={`
                    aspect-square rounded-2xl overflow-hidden transition-all shadow-lg
                    ${isMatched ? "opacity-40 scale-95" : "hover:scale-105 active:scale-95"}
                    ${isSelected ? "ring-4 ring-indigo-500 scale-105 shadow-2xl" : ""}
                    ${item.type === "word" ? "bg-white flex items-center justify-center" : ""}
                  `}

                >
                  {item.type === "image" ? (
                    <img src={item.content} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-center px-2 text-lg font-semibold text-gray-800">
                      {item.content}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Score */}
          <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
            <div className="text-center flex-1">
              <p className="text-xs text-gray-500">Đã ghép</p>
              <p className="text-xl font-bold text-indigo-600">{matchedPairs.length}/6</p>
            </div>

            <div className="w-px h-10 bg-gray-200"></div>

            <div className="text-center flex-1">
              <p className="text-xs text-gray-500">Độ chính xác</p>
              <p className="text-xl font-bold text-green-600">
                {matchedPairs.length === 0
                  ? 0
                  : Math.round((matchedPairs.length / (matchedPairs.length + (5 - hearts))) * 100)}%
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

// Wrapper for params + navigate
const PictureVocabularyGameWithRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  return <PictureVocabularyGame params={params} navigate={navigate} />;
};

export default PictureVocabularyGameWithRouter;
