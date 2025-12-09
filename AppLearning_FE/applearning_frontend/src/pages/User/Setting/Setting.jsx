import { Bell, Globe, Mail, Moon, Settings, Sun, Target, User, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import userService from "../../../services/userService";

export default function Setting() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({ email: "", username: "" });

  // LOCAL STORAGE SETTINGS
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [dailyGoal, setDailyGoal] = useState("casual");
  const [emailUpdates, setEmailUpdates] = useState(true);

  const goals = [
    { id: 'casual', label: 'Casual', xp: '5 XP/day', desc: '5 phút/ngày' },
    { id: 'regular', label: 'Regular', xp: '10 XP/day', desc: '10 phút/ngày' },
    { id: 'serious', label: 'Serious', xp: '20 XP/day', desc: '20 phút/ngày' },
    { id: 'intense', label: 'Intense', xp: '50 XP/day', desc: '50 phút/ngày' }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);

        // Load từ localStorage
        const savedDarkMode = JSON.parse(localStorage.getItem("darkMode") ?? "false");
        setDarkMode(savedDarkMode);
        
        // ✅ THÊM: Apply dark mode ngay khi load
        if (savedDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        setNotifications(JSON.parse(localStorage.getItem("notifications") ?? "true"));
        setSoundEffects(JSON.parse(localStorage.getItem("soundEffects") ?? "true"));
        setDailyGoal(localStorage.getItem("dailyGoal") ?? "casual");
        setEmailUpdates(JSON.parse(localStorage.getItem("emailUpdates") ?? "true"));

      } catch (err) {
        console.error("Load settings failed:", err);
      }

      setLoading(false);
    };

    load();
  }, []);

  // ✅ THÊM: Handle dark mode toggle với real-time update
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Apply ngay lập tức vào HTML
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Lưu vào localStorage
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    
    // Dispatch event để các component khác biết
    window.dispatchEvent(new Event('darkModeChanged'));
  };

  // 🟢 Save vào localStorage
  const saveSettings = () => {
    // Không cần lưu darkMode nữa vì đã lưu real-time ở trên
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("soundEffects", JSON.stringify(soundEffects));
    localStorage.setItem("dailyGoal", dailyGoal);
    localStorage.setItem("emailUpdates", JSON.stringify(emailUpdates));

    alert("Đã lưu cài đặt!");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50'}`}>

      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Settings className={`w-10 h-10 ${darkMode ? 'text-green-400' : 'text-green-600'} animate-spin-slow`} />
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Settings
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Tùy chỉnh trải nghiệm học tập của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-slow:hover { animation: spin-slow 1.5s linear infinite; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Account Info */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {profile.fullName}
              </h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Mục tiêu hàng ngày
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goals.map(goal => (
              <button
                key={goal.id}
                onClick={() => setDailyGoal(goal.id)}
                className={`p-4 rounded-xl border-2 transition ${
                  dailyGoal === goal.id ? 'border-green-500 bg-green-50' :
                  darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' :
                  'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className={`font-bold ${dailyGoal === goal.id ? 'text-green-600' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {goal.label}
                </div>
                <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal.xp}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-6`}>
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-purple-500 mr-3" />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Tùy chỉnh
            </h2>
          </div>

          {/* Dark Mode - ✅ SỬA onToggle */}
          <ToggleItem
            label="Chế độ tối"
            desc="Bảo vệ mắt"
            icon={darkMode ? <Moon className="text-indigo-400" /> : <Sun className="text-yellow-500" />}
            active={darkMode}
            onToggle={handleDarkModeToggle}
            darkMode={darkMode}
          />

          {/* Sound Effects */}
          <ToggleItem
            label="Âm thanh"
            desc="Hiệu ứng âm thanh"
            icon={<Volume2 className="text-pink-500" />}
            active={soundEffects}
            onToggle={() => setSoundEffects(!soundEffects)}
            darkMode={darkMode}
          />

          {/* Notifications */}
          <ToggleItem
            label="Thông báo đẩy"
            desc="Nhắc nhở học tập"
            icon={<Bell className="text-red-500" />}
            active={notifications}
            onToggle={() => setNotifications(!notifications)}
            darkMode={darkMode}
          />

          {/* Email updates */}
          <ToggleItem
            label="Cập nhật email"
            desc="Tin tức & mẹo"
            icon={<Mail className="text-blue-500" />}
            active={emailUpdates}
            onToggle={() => setEmailUpdates(!emailUpdates)}
            darkMode={darkMode}
          />
        </div>

        {/* Save button */}
        <button
          onClick={saveSettings}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Lưu thay đổi
        </button>

      </div>
    </div>
  );
}

// Component Toggle
function ToggleItem({ label, desc, icon, active, onToggle, darkMode }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-3`}>
      <div className="flex items-center">
        <div className="w-6 h-6 mr-3">{icon}</div>
        <div>
          <div className={darkMode ? 'text-white font-medium' : 'text-gray-800 font-medium'}>
            {label}
          </div>
          <div className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
            {desc}
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-colors ${
          active ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
          active ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}