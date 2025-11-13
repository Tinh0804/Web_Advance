import { Component } from 'react';
import { authService } from '../../services';
import { ROUTES } from '../../utils/constants';

// HOC để inject navigate vào class component
import { useNavigate } from 'react-router-dom';

function withRouter(Component) {
  return function WithRouterComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

// Danh sách ngôn ngữ theo database
const LANGUAGES = [
  { id: 1, name: 'English', code: 'EN', flag: '🇬🇧' },
  { id: 2, name: 'Vietnamese', code: 'VI', flag: '🇻🇳' },
  { id: 3, name: 'Japanese', code: 'JA', flag: '🇯🇵' },
  { id: 4, name: 'Korean', code: 'KO', flag: '🇰🇷' },
  { id: 5, name: 'Chinese', code: 'ZH', flag: '🇨🇳' },
  { id: 6, name: 'Spanish', code: 'ES', flag: '🇪🇸' },
  { id: 7, name: 'French', code: 'FR', flag: '🇫🇷' },
  { id: 8, name: 'German', code: 'DE', flag: '🇩🇪' },
];

class Register extends Component {
  state = {
    username: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    nativeLanguagueId: '',
    isLoading: false,
    errorMessage: '',
    fieldErrors: {},
    isLanguageDropdownOpen: false,
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ 
      [name]: value, 
      errorMessage: '',
      fieldErrors: {
        ...this.state.fieldErrors,
        [name]: null,
      }
    });
  };

  handleLanguageSelect = (languageId) => {
    this.setState({ 
      nativeLanguagueId: languageId,
      isLanguageDropdownOpen: false,
      fieldErrors: {
        ...this.state.fieldErrors,
        nativeLanguagueId: null,
      }
    });
  };

  toggleLanguageDropdown = () => {
    this.setState(prev => ({ 
      isLanguageDropdownOpen: !prev.isLanguageDropdownOpen 
    }));
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { username, password, fullName, phoneNumber, nativeLanguagueId } = this.state;
    
    // Validate
    const errors = {};
    if (!username || username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!password || password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!fullName || fullName.trim().length < 2) {
      errors.fullName = 'Full name is required';
    }
    if (!nativeLanguagueId) {
      errors.nativeLanguagueId = 'Please select your native language';
    }
    
    if (Object.keys(errors).length > 0) {
      this.setState({ 
        fieldErrors: errors,
        errorMessage: 'Please fix the errors below',
      });
      return;
    }

    this.setState({ isLoading: true, errorMessage: '', fieldErrors: {} });

    try {
      console.log('Attempting registration with:', {
        username: username.trim(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || null,
        nativeLanguagueId: parseInt(nativeLanguagueId)
      });

      // ✅ Gọi authService.register
      const response = await authService.register({
        username: username.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || null,
        nativeLanguagueId: parseInt(nativeLanguagueId)
      });
      
      console.log('Registration response:', response);
      
      // ✅ Đăng ký thành công -> dùng navigate (không reload page)
      alert('✅ Registration successful! Please login with your account.');
      this.props.navigate(ROUTES.LOGIN); // ← SMOOTH NAVIGATION
      
    } catch (error) {
      console.error('Register error:', error);
      
      this.setState({ 
        errorMessage: typeof error === 'string' ? error : 'Registration failed. Please try again.'
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleLoginClick = () => {
    // ✅ Dùng navigate thay vì window.location.href
    this.props.navigate(ROUTES.LOGIN);
  };

  handleClose = () => {
    // ✅ Dùng navigate thay vì window.location.href
    this.props.navigate(ROUTES.LOGIN);
  };

  render() {
    const { 
      username, 
      password, 
      fullName, 
      phoneNumber, 
      nativeLanguagueId,
      isLoading, 
      errorMessage, 
      fieldErrors,
      isLanguageDropdownOpen 
    } = this.state;

    const selectedLanguage = LANGUAGES.find(lang => lang.id === parseInt(nativeLanguagueId));

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative">
          {/* Close button */}
          <button 
            onClick={this.handleClose}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Login button */}
          <button 
            onClick={this.handleLoginClick}
            className="absolute top-6 right-6 text-blue-500 hover:text-blue-600 font-bold text-sm transition-colors"
          >
            LOGIN
          </button>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mt-8 mb-8">
            Create your profile
          </h1>

          {/* Error message */}
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Native Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={this.toggleLanguageDropdown}
                disabled={isLoading}
                className={`w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 transition-all text-left flex items-center justify-between ${
                  fieldErrors.nativeLanguagueId
                    ? 'ring-2 ring-red-300 focus:ring-red-500'
                    : 'focus:ring-blue-400'
                }`}
              >
                <span className={selectedLanguage ? 'text-gray-800' : 'text-gray-400'}>
                  {selectedLanguage ? (
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{selectedLanguage.flag}</span>
                      <span>{selectedLanguage.name}</span>
                    </span>
                  ) : (
                    'Select your native language'
                  )}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              {isLanguageDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      onClick={() => this.handleLanguageSelect(language.id)}
                      className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <span className="text-gray-800">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {fieldErrors.nativeLanguagueId && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {fieldErrors.nativeLanguagueId}
                </p>
              )}
            </div>

            {/* Username field */}
            <div>
              <input
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                placeholder="Username"
                disabled={isLoading}
                className={`w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  fieldErrors.username
                    ? 'ring-2 ring-red-300 focus:ring-red-500'
                    : 'focus:ring-blue-400'
                }`}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Full Name field */}
            <div>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={this.handleChange}
                placeholder="Full Name"
                disabled={isLoading}
                className={`w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  fieldErrors.fullName
                    ? 'ring-2 ring-red-300 focus:ring-red-500'
                    : 'focus:ring-blue-400'
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Phone Number field (optional) */}
            <div>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={this.handleChange}
                placeholder="Phone Number (optional)"
                disabled={isLoading}
                className="w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            {/* Password field */}
            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Password"
                disabled={isLoading}
                className={`w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  fieldErrors.password
                    ? 'ring-2 ring-red-300 focus:ring-red-500'
                    : 'focus:ring-blue-400'
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={this.handleRegister}
              disabled={isLoading}
              className="w-full py-4 bg-blue-400 text-white font-bold rounded-2xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Social login buttons */}
            <div className="flex gap-3">
              <button 
                type="button" 
                disabled={isLoading}
                className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 font-semibold transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm text-gray-700">FACEBOOK</span>
              </button>
              <button 
                type="button" 
                disabled={isLoading}
                className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 font-semibold transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm text-gray-700">GOOGLE</span>
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
              By signing in to Duolingo, you agree to our{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
            </p>

            {/* reCAPTCHA notice */}
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              This site is protected by reCAPTCHA Enterprise and the Google{' '}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> and{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// ✅ Export với HOC để inject navigate
export default withRouter(Register);