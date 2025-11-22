// src/components/Layout/MainLayout.jsx
import '../../styles/global.scss';
import Footer from './Footer/Footer';
import RightBar from './Rightbar/Rightbar';
import Sidebar from './Sidebar/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar bên trái - RỘNG HƠN */}
      <Sidebar />
      
      {/* Khu vực nội dung + RightBar */}
      <div className="flex flex-1">
        {/* Nội dung chính */}
        <div className="flex-1 ml-80 mr-96 flex flex-col min-h-screen">
          <main className="flex-1 pt-16 pb-8 px-6">
            <div className="animate--fade-in">{children}</div>
          </main>
          <Footer />
        </div>
        
        {/* RightBar cố định bên phải - RỘNG HƠN */}
        <div className="w-120 fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200">
          <RightBar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;