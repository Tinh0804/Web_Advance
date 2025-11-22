// src/pages/Practice/PracticeGame.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import arrangeIcon from '../../assets/icons/arrange.png';
import imageIcon from '../../assets/icons/image.png';
import matchingIcon from '../../assets/icons/matching.png';
import pictureIcon from '../../assets/icons/picture.png';

const gameTypes = [
  { id: 'matching', name: "Matching Game", icon: matchingIcon, color: "from-yellow-400 to-orange-400" },
  { id: 'picture-vocab', name: "Picture Vocabulary Game", icon: pictureIcon, color: "from-pink-400 to-red-400" },
  { id: 'image-word', name: "Image Word Game", icon: imageIcon, color: "from-green-400 to-teal-500" },
  { id: 'arrange', name: "Arrange Word", icon: arrangeIcon, color: "from-blue-400 to-indigo-500" },
];


class PracticeGame extends React.Component {
  handleGameSelect = (gameId) => {
    const { lessonId } = this.props.params;
    const navigate = this.props.navigate;
    navigate(`/practice/game/${gameId}/${lessonId}`);
  };

  render() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
            What type of games?
          </h1>

          <div className="space-y-6">
            {gameTypes.map((game) => (
              <button
                key={game.id}
                onClick={() => this.handleGameSelect(game.id)}
                className="w-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex items-center gap-5 border-2 border-transparent hover:border-purple-300 group"
              >
                {/* Icon từ public/icons/ */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} p-3 flex items-center justify-center shadow-md`}>
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>

                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{game.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">Tap to start practicing!</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 font-bold text-lg">
                  Right Arrow
                </div>
              </button>
            ))}
          </div>

          {/* Nút back */}
          <div className="mt-10 text-center">
            <button
              onClick={() => this.props.navigate(-1)}
              className="text-purple-600 font-medium flex items-center gap-2 mx-auto hover:gap-3 transition-all"
            >
              Left Arrow ← Back to lessons
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Wrapper để dùng useParams + useNavigate trong class component
const PracticeGameWithRouter = () => {
  const params = useParams(); // { lessonId: "89" }
  const navigate = useNavigate();
  return <PracticeGame params={params} navigate={navigate} />;
};

export default PracticeGameWithRouter;