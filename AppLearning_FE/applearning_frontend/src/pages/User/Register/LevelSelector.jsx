import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import duoImage from '../../../assets/images/applelogo.png';
import { authService } from '../../../services';

const LevelOption = ({ bars, title, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full max-w-xl mx-auto p-5 rounded-2xl border-2 transition-all ${
      isSelected
        ? 'border-blue-400 bg-blue-50'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1.5 rounded-full transition-all ${
              bar <= bars
                ? 'bg-blue-400 h-8'
                : 'bg-gray-200 h-6'
            }`}
            style={{
              height: bar <= bars ? `${bar * 8 + 8}px` : '16px'
            }}
          />
        ))}
      </div>
      
      <span className="text-gray-800 font-bold text-lg text-left">
        {title}
      </span>
    </div>
  </button>
);

export default function LevelSelector() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [registerData, setRegisterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const levels = [
    { courseId: 1, bars: 1, title: 'Beginner' },
    { courseId: 2, bars: 2, title: 'Elementary' },
    { courseId: 3, bars: 3, title: 'Intermediate' },
    { courseId: 4, bars: 4, title: 'Advanced' }
  ];

  useEffect(() => {
    const data = localStorage.getItem('registerData');
    if (!data) {
      navigate('/register');
      return;
    }
    
    const parsedData = JSON.parse(data);
    
    // Kiểm tra xem đã có learnLanguageId chưa
    if (!parsedData.learnLanguageId) {
      navigate('/register/select-language');
      return;
    }
    
    setRegisterData(parsedData);
  }, [navigate]);

  const handleContinue = async () => {
    if (selectedLevel === null || !registerData) return;

    setIsLoading(true);
    setError('');

    const level = levels[selectedLevel];
    
    // ✅ Chuẩn bị payload đầy đủ
    const payload = {
      username: registerData.username,
      password: registerData.password,
      fullName: registerData.fullName,
      phoneNumber: registerData.phoneNumber,
      courseId: level.courseId, // 1, 2, 3, hoặc 4
      nativeLanguagueId: registerData.nativeLanguagueId,
      learnLanguageId: registerData.learnLanguageId
    };

    console.log('Registering with payload:', payload);

    try {
      const response = await authService.register(payload);
      
      console.log('Registration successful:', response);
      
      // Xóa dữ liệu tạm
      localStorage.removeItem('registerData');
      
      // Hiển thị thông báo thành công
      alert('Registration successful! Please login with your account.');
      
      // Chuyển về trang login
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(typeof error === 'string' ? error : error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!registerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-start gap-4 mb-12">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 flex items-center justify-center">
                <img 
                src={duoImage} 
                alt="Duo" 
                className="w-full h-full object-contain"
                />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-gray-200 rounded-full blur-sm"></div>
        </div>

          <div className="relative bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-gray-800 font-medium text-lg">
              Trình độ tiếng Anh của bạn ở mức nào?
            </div>
            <div className="absolute left-0 top-8 -translate-x-2 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-200 rotate-45"></div>
          </div>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-6 bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {levels.map((level, index) => (
            <LevelOption
              key={index}
              bars={level.bars}
              title={level.title}
              isSelected={selectedLevel === index}
              onClick={() => setSelectedLevel(index)}
            />
          ))}
        </div>

        {selectedLevel !== null && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleContinue}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-lg transition-all transform hover:scale-105"
            >
              {isLoading ? 'ĐANG XỬ LÝ...' : 'TIẾP TỤC'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}