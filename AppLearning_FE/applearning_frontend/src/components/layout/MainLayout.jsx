import '../../styles/global.scss';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
  
      <div className="ml-64 flex flex-col min-h-screen">
        {/* <Header /> */}
        <main className="flex-1 pt-16 pb-8">
          <div className="animate--fade-in">
            {children}
          </div>
        </main>
        <Footer />
      </div>
      
    </div>
  );
};

export default MainLayout;