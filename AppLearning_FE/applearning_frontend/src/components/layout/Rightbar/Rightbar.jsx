// src/components/RightBar/RightBar.jsx
import {
  Award, Clock, Flame, Gem, Heart,
  Loader2, Lock, Target, Trophy, Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import userService from '../../../services/userService';

const RightBar = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoadingState] = useState(true);

  // REALTIME: Đếm thời gian hoạt động theo giây (để hiện đồng hồ đẹp)
  const [secondsToday, setSecondsToday] = useState(() => {
    const saved = localStorage.getItem('dailyActiveSeconds');
    return saved ? parseInt(saved, 10) : 0;
  });

  const intervalRef = useRef(null);

  // Format giây → phút:giây đẹp như đồng hồ
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Tính tiến độ % cho thanh bar (10 phút = 600 giây)
  const progress = Math.min((secondsToday / 600) * 100, 100);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res.status && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Lỗi tải profile:', err);
        setProfile({ level: 1, streak: 0, gems: 0, hearts: 5 });
      } finally {
        setLoadingState(false);
      }
    };
    loadProfile();
  }, []);

  // REALTIME TIMER: Đếm từng giây khi tab đang mở
  useEffect(() => {
    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setSecondsToday(prev => {
          const newSeconds = prev + 1;
          localStorage.setItem('dailyActiveSeconds', newSeconds.toString());
          return newSeconds;
        });
      }, 1000); // Cập nhật mỗi giây
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reset mỗi ngày mới
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastActiveReset');
    if (lastReset !== today) {
      setSecondsToday(0);
      localStorage.setItem('dailyActiveSeconds', '0');
      localStorage.setItem('lastActiveReset', today);
    }
  }, []);

  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const gems = profile?.gems ?? 0;
  const hearts = profile?.hearts ?? 5;

  return (
    <aside className="h-full w-full bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-y-auto pb-6">
      {/* HEADER */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <img src="/flags/us.svg" alt="US" className="w-5 h-5 rounded-sm" />
            <span className="text-gray-800 font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : level}
            </span>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{loading ? '-' : streak}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <Gem className="w-5 h-5 fill-current" />
            <span className="font-bold text-lg">{loading ? '-' : gems}</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-bold text-lg">{loading ? '-' : hearts}</span>
          </div>
        </div>
      </div>

      {/* SUPER DUOLINGO CARD */}
      <div className="mx-5 mt-5 relative overflow-hidden rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative p-6 text-white">
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold mb-4 border border-white/30">
            <Zap className="w-4 h-4 fill-white" />
            SUPER DUOLINGO
          </div>
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 drop-shadow-lg">Thử Super miễn phí!</h3>
              <div className="space-y-3">
                {['Không quảng cáo', 'Học không giới hạn', 'Tính năng cao cấp'].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-base">{i === 0 ? 'No ads' : i === 1 ? 'Unlimited' : 'Premium'}</span>
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Trophy className="w-14 h-14 text-yellow-300 drop-shadow-2xl" />
            </div>
          </div>
          <button className="w-full py-3.5 bg-white text-purple-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
            THỬ 1 TUẦN MIỄN PHÍ
          </button>
        </div>
      </div>

      {/* LEADERBOARD LOCKED */}
      <div className="mx-5 mt-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-purple-600" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-xs font-bold">9</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bảng xếp hạng</h3>
            <p className="text-sm text-gray-600 mb-3">
              Hoàn thành <span className="font-bold text-purple-600">9 bài học</span> nữa để mở khóa
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative" style={{ width: '10%' }}>
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">1 / 10 bài học</p>
          </div>
        </div>
      </div>

      {/* DAILY QUESTS */}
      <div className="mx-5 mt-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Nhiệm vụ hàng ngày</h3>
          </div>
          <button className="text-xs font-bold text-purple-600 hover:underline">
            XEM TẤT CẢ
          </button>
        </div>

        {/* Quest 1 */}
        <div className="mb-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Kiếm 10 KN</p>
                <p className="text-xs text-gray-600">Kinh nghiệm hàng ngày</p>
              </div>
            </div>
            <Gem className="w-12 h-12 text-orange-500 fill-orange-500" />
          </div>
          <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '0%' }} />
          </div>
          <p className="text-center text-xs font-bold text-gray-700 mt-2">0 / 10 KN</p>
        </div>

        {/* Quest 2 */}
        <div className="mb-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Độ chính xác 90%</p>
                <p className="text-xs text-gray-600">Hoàn thành 1 bài học</p>
              </div>
            </div>
            <Gem className="w-12 h-12 text-emerald-500 fill-emerald-500" />
          </div>
          <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: '0%' }} />
          </div>
          <p className="text-center text-xs font-bold text-gray-700 mt-2">0 / 1 bài học</p>
        </div>

        {/* Quest 3 - HỌC 10 PHÚT (ĐẸP NHƯ DUOLINGO) */}
        <div className="p-5 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border-2 border-sky-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl shadow-lg"></div>
                <div className="absolute inset-0.5 bg-white rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-sky-600" />
                </div>
                <div className="absolute -inset-1 bg-sky-400/20 rounded-xl blur-xl animate-pulse"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Học 10 phút</p>
                <p className="text-xs text-gray-600">Thời gian học hôm nay</p>
              </div>
            </div>
            <Gem className="w-12 h-12 text-sky-500 fill-sky-500" />
          </div>

          {/* Thanh tiến độ + đồng hồ */}
          <div className="relative bg-white/80 rounded-full h-12 overflow-hidden shadow-inner">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-sky-700 drop-shadow-lg">
                {formatTime(secondsToday)}
              </span>
            </div>
            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
          </div>

          <p className="text-center text-xs font-bold text-sky-600 mt-3">
            Đã học {formatTime(secondsToday)} hôm nay
          </p>
        </div>
      </div>

      <div className="h-6" />
    </aside>
  );
};

export default RightBar;