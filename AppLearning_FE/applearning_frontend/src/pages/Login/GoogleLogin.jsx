
export default function GoogleSignIn() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      {/* Close button */}
      <button 
        className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Sign Up button */}
      <button className="absolute top-6 right-6 px-6 py-2 text-blue-400 font-semibold hover:text-blue-500 transition-colors">
        SIGN UP
      </button>

      {/* Main content */}
      <div className="w-full max-w-md animate--slide-up">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Looks like your account was
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800">
            created with Google!
          </h2>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300 flex items-center justify-center shadow-lg hover-glow">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-200"></div>
          </div>
        </div>

        {/* Name */}
        <p className="text-center text-gray-700 font-medium mb-8 text-lg">
          John Doe
        </p>

        {/* Buttons */}
        <div className="space-y-4 mb-8">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover-lift">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          <button className="w-full bg-transparent text-blue-400 font-semibold py-3 px-6 rounded-full hover:bg-blue-50 transition-all duration-200">
            USE ANOTHER ACCOUNT
          </button>
        </div>

        {/* Footer text */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-400">
            By signing in to Duolingo, you agree to our{' '}
            <a href="#" className="text-gray-500 hover:text-gray-700 underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-500 hover:text-gray-700 underline">
              Privacy Policy
            </a>
          </p>

          <p className="text-xs text-gray-400">
            This site is protected by reCAPTCHA Enterprise. See the{' '}
            <a href="#" className="text-gray-500 hover:text-gray-700 underline">
              Google Privacy Policy
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-500 hover:text-gray-700 underline">
              Terms of Service
            </a>{' '}
            apply.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { 
            transform: translateY(20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }
        
        .animate--slide-up {
          animation: slideUp 0.5s ease forwards;
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(147, 197, 253, 0.5);
        }
        
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}