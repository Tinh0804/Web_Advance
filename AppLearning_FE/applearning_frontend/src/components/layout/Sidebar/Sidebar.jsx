// src/components/Layout/Sidebar/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/global.scss';

// Import icons từ assets
import friendIcon from '../../../assets/icons/friend.png';
import homeIcon from '../../../assets/icons/home.png';
import leaderboardIcon from '../../../assets/icons/leaderboard.png';
import practiceIcon from '../../../assets/icons/practice.png';
import profileIcon from '../../../assets/icons/profile.png';
import settingIcon from '../../../assets/icons/setting.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'learn',
      icon: homeIcon,
      label: 'HỌC TẬP',
      path: '/learn',
      color: 'text-orange-500'
    },
    {
      id: 'practice',
      icon: practiceIcon,
      label: 'LUYỆN TẬP',
      path: '/practice',
      color: 'text-red-500'
    },
    {
      id: 'leaderboards',
      icon: leaderboardIcon,
      label: 'XẾP HẠNG',
      path: '/leaderboards',
      color: 'text-yellow-500'
    },
    {
      id: 'friend',
      icon: friendIcon,
      label: 'BẠN BÈ',
      path: '/friend',
      color: 'text-purple-500'
    },
    {
      id: 'profile',
      icon: profileIcon,
      label: 'PROFILE',
      path: '/profile',
      color: 'text-gray-400'
    },
    {
      id: 'setting',
      icon: settingIcon,
      label: 'SETTING',
      path: '/setting',
      color: 'text-gray-400'
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-white border-r-2 border-gray-200 flex flex-col z-50 shadow-lg">
      {/* Logo/Brand */}
      <div className="p-8 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-green-500 tracking-tight">
          appletalk
        </h1>
        <p className="text-sm text-gray-500 mt-1">Học ngôn ngữ mỗi ngày</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`sidebar-item w-full px-8 py-5 flex items-center gap-5 transition-all duration-200 hover:bg-gray-50 group
              ${isActive(item.path) 
                ? 'bg-blue-50 border-r-4 border-blue-500' 
                : 'border-r-4 border-transparent hover:border-r-4 hover:border-gray-300'
              }
            `}
          >
            <img 
              src={item.icon} 
              alt={item.label}
              className="w-8 h-8 transition-transform duration-200 group-hover:scale-110 object-contain"
            />
            <span 
              className={`text-base font-bold tracking-wide uppercase
                ${isActive(item.path) ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-700'}
              `}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-gray-200">
        <div className="text-xs text-gray-400 space-y-1">
          <p className="font-medium">© 2024 AppleTalk</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;