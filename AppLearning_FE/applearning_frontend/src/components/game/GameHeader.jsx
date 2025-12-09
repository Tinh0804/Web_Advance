import { Heart, X } from "lucide-react";
import { useGame } from "../../context/GameContext";

const GameHeader = ({ progress, onBack }) => {
  const { hearts, loading } = useGame();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* BACK BUTTON */}
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* PROGRESS BAR */}
          <div className="flex-1 mx-6">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-400 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* HEARTS */}
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span className="font-bold text-red-500 text-xl">
              {loading ? "…" : hearts}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
