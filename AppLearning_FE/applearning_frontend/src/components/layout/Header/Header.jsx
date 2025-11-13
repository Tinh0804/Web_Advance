import '../../../styles/global.scss';

const Header = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Streak & XP */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-500">0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <span className="font-bold text-blue-500">0</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🔔</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold hover-glow">
            D
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;