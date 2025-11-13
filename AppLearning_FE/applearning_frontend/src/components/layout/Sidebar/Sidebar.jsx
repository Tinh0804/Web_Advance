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
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-green-500 tracking-tight">
          appletalk
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`sidebar-item w-full px-6 py-4 flex items-center gap-4 transition-all duration-200 hover:bg-gray-50
              ${isActive(item.path) ? 'bg-blue-50 border-r-4 border-blue-500' : 'border-r-4 border-transparent'}
            `}
          >
            <span className={`text-2xl ${item.color}`}>
              {item.icon}
            </span>
            <span 
              className={`text-sm font-bold tracking-wide uppercase
                ${isActive(item.path) ? 'text-blue-500' : 'text-gray-400'}
              `}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;