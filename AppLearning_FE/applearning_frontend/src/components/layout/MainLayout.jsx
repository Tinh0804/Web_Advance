// src/components/Layout/MainLayout.jsx
import { useState, useEffect } from 'react'; // ✅ THÊM import
import '../../styles/global.scss';
import Footer from './Footer/Footer';
import RightBar from './Rightbar/Rightbar';
import Sidebar from './Sidebar/Sidebar';

const MainLayout = ({ children }) => {
  // ✅ THÊM: State dark mode
  const [darkMode, setDarkMode] = useState(() => 
    JSON.parse(localStorage.getItem("darkMode") || "false")
  );

  // ✅ THÊM: Listen cho thay đổi dark mode
  useEffect(() => {
    const handleDarkModeChange = () => {
      const newDarkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
      setDarkMode(newDarkMode);
    };

    // Listen event từ Setting page
    window.addEventListener('darkModeChanged', handleDarkModeChange);
    
    // Listen storage change (cho multi-tab)
    window.addEventListener('storage', handleDarkModeChange);

    // Cleanup
    return () => {
      window.removeEventListener('darkModeChanged', handleDarkModeChange);
      window.removeEventListener('storage', handleDarkModeChange);
    };
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {/* Sidebar bên trái - RỘNG HƠN */}
      <Sidebar darkMode={darkMode} />
      
      {/* Khu vực nội dung + RightBar */}
      <div className="flex flex-1">
        {/* Nội dung chính */}
        <div className="flex-1 ml-80 mr-96 flex flex-col min-h-screen">
          <main className={`flex-1 pt-16 pb-8 px-6 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
            <div className="animate--fade-in">{children}</div>
          </main>
          <Footer darkMode={darkMode} />
        </div>
        
        {/* RightBar cố định bên phải - RỘNG HƠN */}
        <div className={`w-120 fixed right-0 top-0 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl border-l ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <RightBar darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;