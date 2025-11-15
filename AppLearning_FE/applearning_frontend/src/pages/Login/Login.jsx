"use client";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import { OAUTH_CONFIG, ROUTES } from '../../utils/constants';
import { validateLogin } from '../../utils/validators';

export default function Login() {
  const navigate = useNavigate(); 
  
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    isLoading: false,
    errorMessage: '',
    fieldErrors: {},
  });

  // Load Google SDK
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: OAUTH_CONFIG.GOOGLE.CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    };

    loadGoogleScript();
  }, []);

  // Load Facebook SDK
  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: OAUTH_CONFIG.FACEBOOK.APP_ID,
          cookie: true,
          xfbml: true,
          version: OAUTH_CONFIG.FACEBOOK.SDK_VERSION
        });
      };

      // Load the SDK
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    loadFacebookSDK();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
      errorMessage: '',
      fieldErrors: {
        ...prev.fieldErrors,
        [name]: null,
      }
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formState;
    
    const { isValid, errors } = validateLogin(username, password);
    
    if (!isValid) {
      setFormState(prev => ({
        ...prev,
        fieldErrors: errors,
        errorMessage: 'Please fix the errors below',
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, errorMessage: '', fieldErrors: {} }));

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      const response = await authService.login(trimmedUsername, trimmedPassword);
      
      if (response.status && response.data) {
        const { token, refreshToken, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate(ROUTES.LEARN);
      } else {
        setFormState(prev => ({
          ...prev,
          errorMessage: response.message || 'Login failed'
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormState(prev => ({
        ...prev,
        errorMessage: error || 'Login failed. Please try again.'
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Google Login Handler
  const handleGoogleResponse = async (response) => {
    try {
      setFormState(prev => ({ ...prev, isLoading: true, errorMessage: '' }));
      
      // response.credential chứa JWT token từ Google
      const result = await authService.externalLogin('Google', response.credential);
      console.log('Google login result:', result);
      if (result.status && result.data) 
        navigate(ROUTES.LEARN);
      else 
        setFormState(prev => ({...prev,errorMessage: result.message || 'Google login failed'}));
    } catch (error) {
      console.error('Google login error:', error);
      setFormState(prev => ({
        ...prev,
        errorMessage: error || 'Google login failed. Please try again.'
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogleLoginClick = () => {
    if (window.google) 
      window.google.accounts.id.prompt(); 
    else 
      setFormState(prev => ({...prev,errorMessage: 'Google login is not ready. Please refresh and try again.'}));
  };

  // Facebook Login Handler
  const handleFacebookLoginClick = () => {
  if (!window.FB) {
    setFormState(prev => ({...prev, errorMessage: 'Facebook login is not ready. Please refresh and try again.'}));
    return;
  }

  setFormState(prev => ({ ...prev, isLoading: true, errorMessage: '' }));

  window.FB.login((response) => {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      processFacebookLogin(accessToken);
    } else {
      setFormState(prev => ({ 
        ...prev, 
        isLoading: false,
        errorMessage: 'Facebook login cancelled'
      }));
    }
  }, { scope: 'public_profile,email' });
};

const processFacebookLogin = async (accessToken) => {
  try {
    const result = await authService.externalLogin('facebook', accessToken);

    if (result.status && result.data) 
      navigate(ROUTES.LEARN);
    else 
      setFormState(prev => ({...prev, errorMessage: result.message || 'Facebook login failed'}));
  } catch (error) {
    console.error('Facebook login error:', error);
    setFormState(prev => ({...prev,errorMessage: error || 'Facebook login failed. Please try again.'}));
  } finally {
    setFormState(prev => ({ ...prev, isLoading: false }));
  }
};


  const handleSignUpClick = () => {
    navigate(ROUTES.REGISTER); 
  };

  const { username, password, isLoading, errorMessage, fieldErrors } = formState;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-5 flex justify-end">
        <button 
          onClick={handleSignUpClick}
          className="px-6 py-2 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          SIGN UP
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5">
        <h1 className="text-4xl font-bold mb-10">Log in</h1>

        <div className="w-full max-w-md flex flex-col gap-5">
          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <div>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Username or Email"
              disabled={isLoading}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                fieldErrors.username
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                disabled={isLoading}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                  fieldErrors.password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:text-blue-700 font-bold transition-colors"
              >
                FORGOT?
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'LOGGING IN...' : 'LOG IN'}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleFacebookLoginClick}
              type="button" 
              disabled={isLoading}
              className="flex-1 py-3 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 font-bold transition-all disabled:opacity-50"
            >
              <img 
                  src={require("../../assets/icons/fb.png")} 
                  alt="Facebook"
                  className="w-6 h-6 object-contain"
              />
              FACEBOOK
            </button>
            <button 
              onClick={handleGoogleLoginClick}
              type="button" 
              disabled={isLoading}
              className="flex-1 py-3 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 font-bold transition-all disabled:opacity-50">
              <img 
                  src={require("../../assets/icons/gg.png")} 
                  alt="Google"
                  className="w-5 h-5 object-contain"
              />
              GOOGLE
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-8">
            By signing in, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}