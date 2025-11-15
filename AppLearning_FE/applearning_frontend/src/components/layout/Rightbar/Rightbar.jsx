// src/components/RightBar/RightBar.jsx
import { Flame, Gem, Heart, Lock, Target, Clock, ChevronDown } from 'lucide-react';

const RightBar = () => {
  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-gray-50 z-50 flex flex-col overflow-y-auto border-l border-gray-200">
      {/* === HEADER: Level, Lingots, Gems, Hearts === */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between text-sm font-medium">
          {/* Level */}
          <div className="flex items-center gap-2">
            <img src="/flags/us.svg" alt="US" className="w-5 h-5 rounded-sm" />
            <span className="text-gray-700">5</span>
          </div>

          {/* Lingots */}
          <div className="flex items-center gap-1 text-gray-500">
            <Flame className="w-5 h-5 text-orange-500" />
            <span>0</span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1 text-blue-600">
            <Gem className="w-5 h-5 fill-current" />
            <span className="font-bold">505</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1 text-red-500">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-bold">5</span>
          </div>
        </div>
      </div>

      {/* === SUPER DUOLINGO TRIAL === */}
      <div className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-2">
              SUPER
            </div>
            <h3 className="font-bold text-gray-900">Thử Super miễn phí</h3>
            <p className="text-sm text-gray-600 mt-1 leading-tight">
              Không quảng cáo, học phù hợp với trình độ và không giới hạn số lần
              chinh phục Huyền thoại!
            </p>
          </div>
          <img
            src="/mascot/super-owl.png"
            alt="Super Owl"
            className="w-16 h-16 object-contain"
          />
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition shadow-md">
          THỬ 1 TUẦN MIỄN PHÍ
        </button>
      </div>

      {/* === LEADERBOARD LOCK === */}
      <div className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">Mở khóa Bảng xếp hạng!</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Hoàn thành thêm <strong>9 bài học</strong> để bắt đầu thi đua
            </p>
          </div>
        </div>
      </div>

      {/* === DAILY QUESTS === */}
      <div className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Nhiệm vụ hàng ngày</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">
            XEM TẤT CẢ
          </button>
        </div>

        {/* Quest 1: Kiếm 10 KN */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Kiếm 10 KN</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <img src="/icons/chest-small.png" alt="Chest" className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
              style={{ width: '0%' }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">0 / 10</p>
        </div>

        {/* Quest 2: Ho (90% accuracy) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Hoàn thành 1 bài học với độ chính xác từ 90% trở lên
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <img src="/icons/chest-small.png" alt="Chest" className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full"
              style={{ width: '0%' }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">0 / 1</p>
        </div>

        {/* Quest 3: Học 10 phút */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Học trong 10 phút</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <img src="/icons/chest-small.png" alt="Chest" className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
              style={{ width: '60%' }}
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">6 / 10 phút</p>
        </div>
      </div>

      {/* === FOOTER SPACE === */}
      <div className="h-20" />
    </aside>
  );
};

export default RightBar;