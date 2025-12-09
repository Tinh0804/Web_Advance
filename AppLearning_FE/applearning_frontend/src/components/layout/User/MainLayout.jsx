// src/components/Layout/MainLayout.jsx
import { useEffect, useState } from 'react';
import '../../../styles/global.scss';
import Footer from './Footer/Footer';
import RightBar from './Rightbar/Rightbar';
import Sidebar from './Sidebar/Sidebar';

import { UserProvider } from '../../../context/UserContext';

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() =>
    JSON.parse(localStorage.getItem("darkMode") || "false")
  );

  useEffect(() => {
    const handleDarkModeChange = () => {
      const newDarkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
      setDarkMode(newDarkMode);
    };
    window.addEventListener('darkModeChanged', handleDarkModeChange);
    window.addEventListener('storage', handleDarkModeChange);
    return () => {
      window.removeEventListener('darkModeChanged', handleDarkModeChange);
      window.removeEventListener('storage', handleDarkModeChange);
    };
  }, []);

  return (
    <UserProvider>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Sidebar */}
        <div className="w-80 fixed left-0 top-0 h-full z-50">
          <Sidebar darkMode={darkMode} />
        </div>

        {/* RightBar */}
        <div className={`w-[440px] fixed right-0 top-0 h-full overflow-y-auto z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl border-l-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <RightBar darkMode={darkMode} />
        </div>

        {/* Main Content */}
        <div className="ml-80 mr-[440px]">
          <main className={`min-h-screen pt-16 pb-8 px-6 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
            <div className="animate--fade-in">{children}</div>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </UserProvider>
  );
};

export default MainLayout;