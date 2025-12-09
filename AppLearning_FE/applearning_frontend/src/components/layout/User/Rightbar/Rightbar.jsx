import { Loader2, Lock } from 'lucide-react';
import diamondIcon from '../../../../assets/icons/diamond.png';
import fireIcon from '../../../../assets/icons/fire.png';
import flagIcon from '../../../../assets/icons/flat.png';
import heartIcon from '../../../../assets/icons/heart.png';
import logo2 from '../../../../assets/icons/logo2.png';
import { useUser } from '../../../../context/UserContext';

const RightBar = () => {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <aside className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </aside>
    );
  }

  return (
    <aside className="h-full w-full bg-white flex flex-col overflow-y-auto">

      {/* HEADER - STATS */}
      <div className="px-6 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <img src={flagIcon} alt="Level" className="w-8 h-8 mb-1" />
            <span className="font-black text-gray-800 text-xl">
              {profile?.level || 1}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <img src={fireIcon} alt="Streak" className="w-8 h-8 mb-1" />
            <span className="font-black text-orange-500 text-xl">
              {profile?.currentStreak || 0}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <img src={diamondIcon} alt="Diamond" className="w-8 h-8 mb-1" />
            <span className="font-black text-blue-400 text-xl">
              {profile?.diamond || 0}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <img src={heartIcon} alt="Heart" className="w-8 h-8 mb-1" />
            <span className="font-black text-red-500 text-xl">
              {profile?.hearts || 0}
            </span>
          </div>
        </div>
      </div>

      {/* SUPER CARD */}
      <div className="px-6 py-5">
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm">

          {/* Badge SUPER */}
          <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
            <span className="text-white text-xs font-black tracking-wide">SUPER</span>
          </div>

          {/* FLEX TEXT - LOGO */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h3 className="font-black text-gray-900 mb-3">
                Thử Super miễn phí
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Không quảng cáo, học phù hợp với trình độ và không giới hạn số lần chinh phục Huyền thoại!
              </p>
            </div>

            <div className="flex-shrink-0">
              <img
                src={logo2}
                alt="App"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all text-base shadow-lg">
            THỬ 1 TUẦN MIỄN PHÍ
          </button>
        </div>
      </div>

      {/* LEADERBOARD LOCKED */}
      <div className="px-6 pb-5">
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                <Lock className="w-10 h-10 text-gray-400" strokeWidth={2} />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-900 mb-2">
                Mở khóa Bảng xếp hạng!
              </h3>
              <p className="text-sm text-gray-600 leading-snug">
                Hoàn thành thêm 8 bài học để bắt đầu thi đua
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY QUESTS */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-900">Nhiệm vụ hàng ngày</h3>
            <button className="text-xs font-black text-blue-500 hover:underline tracking-wider">
              XEM TẤT CẢ
            </button>
          </div>

          {/* Quest 1 */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <img src={fireIcon} alt="Fire" className="w-8 h-8" />
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-base font-black text-gray-900 mb-2">Kiếm 10 KN</h4>

              {/* Progress bar luôn = 0% */}
              <div className="bg-gray-200 rounded-full h-3.5 overflow-hidden mb-1">
                <div
                  className="h-full bg-gray-300 rounded-full transition-all"
                  style={{ width: `0%` }}
                />
              </div>

              <p className="text-xs text-gray-500 text-center font-bold">
                0 / 10
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </aside>
  );
};

export default RightBar;
