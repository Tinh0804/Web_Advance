import '../../styles/global.scss';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar/Sidebar';
import RightBar from './Rightbar/Rightbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Khu vực nội dung + RightBar */}
      <div className="flex flex-1">
        {/* Nội dung chính */}
        <div className="flex-1 ml-64 mr-72 flex flex-col min-h-screen">
          <main className="flex-1 pt-16 pb-8 px-6">
            <div className="animate--fade-in">{children}</div>
          </main>
          <Footer />
        </div>

        {/* RightBar cố định bên phải */}
        <div className="w-72 fixed right-0 top-0 h-full bg-white shadow-xl border-l">
          <RightBar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;