import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageCard = ({ flag, name, learners, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer flex flex-col items-center gap-4"
  >
    <div className="text-6xl">{flag}</div>
    <div className="text-center">
      <div className="font-bold text-gray-800 text-lg mb-1">{name}</div>
      <div className="text-gray-500 text-sm">{learners}</div>
    </div>
  </button>
);

export default function LanguageSelector() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState(null);

  // ✅ Danh sách ngôn ngữ khớp với database
  const languages = [
    { id: 1, flag: '🇬🇧', name: 'English', learners: '11.7M learners' },
    { id: 2, flag: '🇻🇳', name: 'Vietnamese', learners: '2.86M learners' },
    { id: 3, flag: '🇯🇵', name: 'Japanese', learners: '247K learners' },
    { id: 4, flag: '🇰🇷', name: 'Korean', learners: '225K learners' },
    { id: 5, flag: '🇨🇳', name: 'Chinese', learners: '2.86M learners' },
    { id: 6, flag: '🇪🇸', name: 'Spanish', learners: '111K learners' },
    { id: 7, flag: '🇫🇷', name: 'French', learners: '186K learners' },
    { id: 8, flag: '🇩🇪', name: 'German', learners: '116K learners' },
  ];

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const data = localStorage.getItem('registerData');
    if (!data) {
      // Nếu không có dữ liệu, quay về trang đăng ký
      navigate('/register');
      return;
    }
    setRegisterData(JSON.parse(data));
  }, [navigate]);

  const handleLanguageSelect = (languageId) => {
    if (!registerData) return;

    // Lưu learnLanguageId vào registerData
    const updatedData = {
      ...registerData,
      learnLanguageId: languageId
    };
    
    localStorage.setItem('registerData', JSON.stringify(updatedData));
    
    // Chuyển sang trang chọn level
    navigate('/register/select-level');
  };

  if (!registerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <span className="text-green-600 font-bold text-2xl">duolingo</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
          Tôi muốn học...
        </h1>
        <p className="text-gray-500 text-center mb-12">
          Chọn ngôn ngữ bạn muốn học
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <LanguageCard
              key={lang.id}
              flag={lang.flag}
              name={lang.name}
              learners={lang.learners}
              onClick={() => handleLanguageSelect(lang.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}