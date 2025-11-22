// src/components/RightBar/RightBar.jsx
import { Award, Clock, Flame, Gem, Heart, Lock, Star, Target, Trophy, Zap } from 'lucide-react';

const RightBar = () => {
  return (
    <aside className="h-full w-full bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-y-auto">
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

      {/* === SUPER DUOLINGO CARD === */}
      <div className="mx-5 mt-5 relative overflow-hidden rounded-3xl shadow-xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative p-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full mb-4 shadow-lg border border-white/30">
            <Zap className="w-4 h-4 fill-white" />
            SUPER DUOLINGO
          </div>
          
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-1">
              <h3 className="font-bold text-white text-xl mb-3 drop-shadow-lg">
                Thử Super miễn phí!
              </h3>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-white/95">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base">🚀</span>
                  </div>
                  <span className="text-sm font-medium">Không quảng cáo</span>
                </div>
                <div className="flex items-center gap-3 text-white/95">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base">⚡</span>
                  </div>
                  <span className="text-sm font-medium">Học không giới hạn</span>
                </div>
                <div className="flex items-center gap-3 text-white/95">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base">💎</span>
                  </div>
                  <span className="text-sm font-medium">Tính năng cao cấp</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Trophy className="w-14 h-14 text-yellow-300 drop-shadow-xl" />
              </div>
            </div>
          </div>
          
          <button className="w-full py-3.5 bg-white text-purple-600 font-bold text-sm rounded-2xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] transform duration-200">
            THỬ 1 TUẦN MIỄN PHÍ
          </button>
        </div>
      </div>

      {/* === LEADERBOARD LOCK === */}
      <div className="mx-5 mt-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 rounded-2xl flex items-center justify-center shadow-md">
              <Lock className="w-10 h-10 text-purple-600" strokeWidth={2} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
              <span className="text-white text-xs font-bold">9</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Bảng xếp hạng</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              Hoàn thành <span className="font-bold text-purple-600">9 bài học</span> nữa để mở khóa
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-2.5 rounded-full relative transition-all duration-500" 
                style={{ width: '10%' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">1 / 10 bài học</p>
          </div>
        </div>
      </div>

      {/* === DAILY QUESTS === */}
      <div className="mx-5 mt-5 mb-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-gray-900 text-xl">Nhiệm vụ hàng ngày</h3>
          </div>
          <button className="text-xs text-purple-600 font-bold hover:text-purple-700 hover:underline transition-colors">
            XEM TẤT CẢ
          </button>
        </div>

        {/* Quest 1: Kiếm 10 KN */}
        <div className="mb-5 p-5 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border-2 border-amber-200/60 hover:shadow-lg hover:border-amber-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-base mb-1">Kiếm 10 KN</p>
                <p className="text-xs text-gray-600">Kinh nghiệm hàng ngày</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-amber-200">
              <Gem className="w-6 h-6 text-orange-500 fill-orange-500" />
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-3.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 h-3.5 rounded-full transition-all duration-500 relative"
              style={{ width: '0%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs font-bold text-gray-700">0 / 10 KN</span>
            <div className="flex gap-0.5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < 0 ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Quest 2: Độ chính xác 90% */}
        <div className="mb-5 p-5 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl border-2 border-emerald-200/60 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-base mb-1">Độ chính xác 90%</p>
                <p className="text-xs text-gray-600">Hoàn thành 1 bài học</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-emerald-200">
              <Gem className="w-6 h-6 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-3.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3.5 rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs font-bold text-gray-700">0 / 1 bài học</span>
            <Star className="w-4 h-4 text-gray-300 fill-gray-300" />
          </div>
        </div>

        {/* Quest 3: Học 10 phút */}
        <div className="p-5 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 rounded-2xl border-2 border-sky-200/60 hover:shadow-lg hover:border-sky-300 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative">
                <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-base mb-1">Học 10 phút</p>
                <p className="text-xs text-gray-600">Thời gian học hàng ngày</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-sky-200">
              <Gem className="w-6 h-6 text-sky-500 fill-sky-500" />
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-3.5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-sky-400 to-cyan-500 h-3.5 rounded-full transition-all duration-500 relative"
              style={{ width: '60%' }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs font-bold text-sky-600">6 / 10 phút</span>
            <span className="text-lg">⏰</span>
            <div className="flex gap-0.5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i < 6 ? 'bg-sky-400' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer space */}
      <div className="h-6" />
    </aside>
  );
};

export default RightBar;