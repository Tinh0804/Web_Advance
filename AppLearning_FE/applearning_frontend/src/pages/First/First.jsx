const LANGUAGES = [
  { name: 'SPANISH', flag: '🇪🇸'},
  { name: 'FRENCH', flag: '🇫🇷' },
  { name: 'GERMAN', flag: '🇩🇪' },
  { name: 'ITALIAN', flag: '🇮🇹' },
  { name: 'PORTUGUESE', flag: '🇵🇹' },
  { name: 'DUTCH', flag: '🇳🇱'},
  { name: 'JAPANESE', flag: '🇯🇵'},
];

export default function DuolingoLanding() {
  const scrollLeft = () => {
    const container = document.getElementById('lang-scroll');
    if (container) {
      container.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('lang-scroll');
    if (container) {
      container.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    window.location.href = '/register';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-900 to-blue-950 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2.5 + 0.5 + 'px',
              height: Math.random() * 2.5 + 0.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .globe-float {
          animation: float 6s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 px-6 md:px-12 py-6 flex items-center justify-between">
        <h1 className="text-white text-3xl md:text-4xl font-bold">appletalk</h1>
        <button className="text-white text-xs md:text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
          SITE LANGUAGE: ENGLISH
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Globe - Left Side */}
          <div className="flex justify-center md:justify-end order-2 md:order-1">
            <div className="globe-float w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <img 
                src={require("../../assets/images/earth.png")}
                alt="Earth Globe" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Text Content - Right Side */}
          <div className="text-center md:text-left space-y-6 md:space-y-8 order-1 md:order-2">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight px-4 md:px-0">
              The free, fun, and effective way to learn a language!
            </h2>

            <div className="flex flex-col gap-4 items-center md:items-start px-4 md:px-0">
              <button 
                onClick={handleGetStarted}
                className="w-full md:w-auto px-12 md:px-16 py-4 bg-green-500 hover:bg-green-600 text-white text-base md:text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                GET STARTED
              </button>

              <button 
                onClick={handleLogin}
                className="w-full md:w-auto px-8 md:px-10 py-3 md:py-3.5 bg-blue-700 hover:bg-blue-600 text-white text-sm md:text-base font-bold rounded-2xl transition-all border-2 border-blue-500 hover:border-blue-400"
              >
                I ALREADY HAVE AN ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Language Carousel */}
      <div className="relative z-10 mt-8 md:mt-12 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Previous languages"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Languages Scroll Container */}
            <div
              id="lang-scroll"
              className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {LANGUAGES.map((lang, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-blue-800 border-2 border-blue-600 rounded-xl hover:bg-blue-700 hover:border-blue-500 transition-all cursor-pointer"
                  style={{ minWidth: '130px' }}
                >
                  <div
                    className="w-7 h-5 md:w-8 md:h-6 rounded flex items-center justify-center text-lg md:text-xl flex-shrink-0"
                    style={{ backgroundColor: lang.color }}
                  >
                    {lang.flag}
                  </div>
                  <span className="text-white text-xs md:text-sm font-bold whitespace-nowrap">
                    {lang.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Next languages"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}