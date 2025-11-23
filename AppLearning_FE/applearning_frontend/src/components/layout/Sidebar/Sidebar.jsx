// src/components/Layout/Sidebar/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/global.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'learn',
      icon: '🏠',
      label: 'HỌC TẬP',
      path: '/learn',
      color: 'text-orange-500'
    },
    {
      id: 'practice',
      icon: '🏪',
      label: 'LUYỆN TẬP',
      path: '/practice',
      color: 'text-red-500'
    },
    {
      id: 'leaderboards',
      icon: '🏆',
      label: 'XẾP HẠNG',
      path: '/leaderboards',
      color: 'text-yellow-500'
    },
    {
      id: 'friend',
      icon: '👥',
      label: 'BẠN BÈ',
      path: '/friend',
      color: 'text-purple-500'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'PROFILE',
      path: '/profile',
      color: 'text-gray-400'
    },
    {
      id: 'setting',
      icon: '⚙️',
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
    <aside className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-gray-200 flex flex-col z-50 shadow-sm">
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
            <span className={`text-3xl ${item.color} transition-transform duration-200 group-hover:scale-110`}>
              {item.icon}
            </span>
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

      {/* Footer Info (Optional) */}
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