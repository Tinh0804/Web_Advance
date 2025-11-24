import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Check, Award, Loader2, ChevronRight } from "lucide-react";
import exerciseService from "../../services/exerciseService";

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
            completedExercises: 0
        };
        
        // Sound effects
        this.correctSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWe77OivUhELTqXh8bllHAU2jdXyzn0vBSl+zPLaizsKGGS57OqsWhEMUKjj8bllHAU3jtXy0H8vBSh+zPLbizsKF2O47OqsWhEMUKjj8bllHAU3jtXy0H8vBSh+zPLbizsKF2O47OqsWhEMUKjj8bllHAU3jtXy0H8vBSh+zPLbizsKF2O47Oq');
        this.incorrectSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAgIqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWe77OivUhELTqXh8bllHAU2jdXyzn0vBSl+zPLaizsKGGS57OqsWhEMUKjj8bllHAU3jtXy0H8vBSh+zPLbizsKF2O47OqsWhEMUKjj8bllHAU3jtXy0H8vBSh+zPLbizsKF2O47OqsWhEMUKjj8bllHAU3jtXy0H8vBSh+zPLbizsKF2O47Oq');
    }

    componentDidMount() {
        this.fetchExercises();
    }

    fetchExercises = async () => {
        const { lessonId } = this.props.params;

        try {
            this.setState({ loading: true, error: null });

            const result = await exerciseService.getByLesson(lessonId);

            if (result.status && result.data) {
                const wordOrderExercises = result.data.filter(
                    ex => ex.exerciseType === "word_order"
                );

                if (wordOrderExercises.length > 0) {
                    this.setState({
                        exercises: wordOrderExercises,
                        totalExercises: wordOrderExercises.length,
                        loading: false
                    }, this.setupCurrentExercise);
                } else {
                    const demoExercises = [
                        {
                            exerciseId: 11,
                            lessonId: parseInt(lessonId),
                            exerciseType: "word_order",
                            question: "Sắp xếp lại các từ để tạo thành câu đúng.",
                            correctAnswer: "We welcome our guests.",
                            experienceReward: 10
                        }
                    ];

                    this.setState({
                        exercises: demoExercises,
                        totalExercises: demoExercises.length,
                        loading: false
                    }, this.setupCurrentExercise);
                }
            } else {
                throw new Error(result.message || "Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching exercises:", error);
            this.setState({
                error: "Failed to load exercises from server.",
                loading: false
            });
        }
    };

    setupCurrentExercise = () => {
        const { exercises, currentExerciseIndex } = this.state;
        if (currentExerciseIndex >= exercises.length) return;

        const currentExercise = exercises[currentExerciseIndex];
        const words = currentExercise.correctAnswer.split(" ");

        const distractors = ["quickly", "always", "never", "sometimes"];
        const selectedDistractors = distractors.sort(() => Math.random() - 0.5).slice(0, 2);

        const allWords = [...words, ...selectedDistractors].sort(() => Math.random() - 0.5);

        this.setState({
            availableWords: allWords,
            selectedWords: [],
            showResult: false,
            isCorrect: false
        });
    };

    handleWordClick = (word, index, isSelected) => {
        if (this.state.showResult || this.state.submitting) return;

        if (isSelected) {
            this.setState(prev => ({
                selectedWords: prev.selectedWords.filter((_, i) => i !== index)
            }));
        } else {
            this.setState(prev => ({
                selectedWords: [...prev.selectedWords, word]
            }));
        }
    };

    checkAnswer = async () => {
        const { exercises, currentExerciseIndex, selectedWords } = this.state;
        const currentExercise = exercises[currentExerciseIndex];
        const userAnswer = selectedWords.join(" ");

        const userStr = localStorage.getItem("user");
        const userId = userStr ? JSON.parse(userStr).userId : 1;

        try {
            this.setState({ submitting: true });

            const result = await exerciseService.submit({
                exerciseId: currentExercise.exerciseId,
                userId: userId,
                userAnswer: userAnswer
            });

            if (result.status && result.data) {
                this.setState({
                    showResult: true,
                    isCorrect: result.data.isCorrect,
                    correctAnswer: result.data.correctAnswer,
                    experienceEarned: result.data.experienceEarned,
                    submitting: false
                });
                
                // Play sound effect
                if (result.data.isCorrect) {
                    this.correctSound.play().catch(e => console.log('Audio play failed:', e));
                    setTimeout(this.nextExercise, 1500);
                } else {
                    this.incorrectSound.play().catch(e => console.log('Audio play failed:', e));
                }
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            this.setState({ submitting: false });
        }
    };

    nextExercise = () => {
        const { currentExerciseIndex, exercises } = this.state;

        if (currentExerciseIndex < exercises.length - 1) {
            this.setState(prevState => ({
                currentExerciseIndex: prevState.currentExerciseIndex + 1,
                completedExercises: prevState.completedExercises + 1,
                showResult: false
            }), this.setupCurrentExercise);
        } else {
            alert("Congratulations! You completed all exercises!");
            this.props.navigate("/lessons");
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
            completedExercises
        } = this.state;

        if (loading) {
            return (
                <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="animate-spin w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg font-medium">Loading exercises...</p>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate("/lessons")}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                        >
                            Back to Lessons
                        </button>
                    </div>
                </div>
            );
        }

        const currentExercise = exercises[currentExerciseIndex];
        const remainingWords = availableWords.filter(w => !selectedWords.includes(w));
        const progress = (completedExercises / totalExercises) * 100;

        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24 pr-8">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 z-10 mr-8">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/lessons")}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>

                            <div className="flex-1">
                                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 transition-all duration-500 rounded-full"
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

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-6 py-8 pr-8">
                    {/* Question Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 mr-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {currentExercise.question}
                                </h2>
                                <p className="text-gray-500">
                                    Tap the words to build your answer
                                </p>
                            </div>
                        </div>

                        {/* Selected Words Area */}
                        <div className="min-h-32 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 mb-6">
                            {selectedWords.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-400 text-center text-lg">
                                        👆 Tap words below to start building your sentence
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {selectedWords.map((word, i) => (
                                        <button
                                            key={i}
                                            onClick={() => this.handleWordClick(word, i, true)}
                                            disabled={submitting}
                                            className="group relative px-5 py-3 bg-white border-2 border-blue-400 rounded-xl text-lg font-semibold text-gray-800 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
                                        >
                                            {word}
                                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                ×
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Available Words */}
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Available Words
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {remainingWords.map((word, i) => (
                                    <button
                                        key={i}
                                        onClick={() => this.handleWordClick(word, i, false)}
                                        disabled={submitting}
                                        className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl text-lg font-semibold text-gray-700 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Result Message */}
                    {showResult && (
                        <div
                            className={`rounded-3xl p-8 mb-8 shadow-xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 mr-8 ${
                                isCorrect
                                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
                                    : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                                        isCorrect ? "bg-green-500" : "bg-red-500"
                                    }`}
                                >
                                    {isCorrect ? (
                                        <Check className="w-8 h-8 text-white" />
                                    ) : (
                                        <X className="w-8 h-8 text-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    {isCorrect ? (
                                        <div>
                                            <h3 className="text-3xl font-bold text-green-700 mb-2">
                                                Awesome! 🎉
                                            </h3>
                                            <p className="text-green-600 text-lg">
                                                Perfect answer! Keep it up!
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <h3 className="text-3xl font-bold text-red-700 mb-2">
                                                Not quite right 😅
                                            </h3>
                                            <p className="text-red-600 mb-3">The correct answer is:</p>
                                            <p className="text-red-800 font-semibold text-lg bg-white/50 px-4 py-2 rounded-xl">
                                                {correctAnswer}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {isCorrect && (
                                    <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                                        <Award className="w-5 h-5" />
                                        <span className="font-bold text-lg">+{experienceEarned}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mr-8">
                        <button
                            onClick={this.skipExercise}
                            disabled={submitting}
                            className="flex-1 py-4 px-6 bg-white border-2 border-gray-300 rounded-2xl text-gray-700 font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            SKIP
                        </button>

                        <button
                            onClick={this.checkAnswer}
                            disabled={selectedWords.length === 0 || submitting || showResult}
                            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                                selectedWords.length === 0 || submitting || showResult
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-green-500/50"
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    CHECKING...
                                </>
                            ) : (
                                <>
                                    CHECK
                                    <ChevronRight className="w-5 h-5" />
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