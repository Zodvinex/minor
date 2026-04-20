import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, googleLogin } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const googleButtonRef = useRef(null);

  const onAuthSuccess = useCallback((userData) => {
    login(userData);
    if (userData.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    navigate('/student/dashboard');
  }, [login, navigate]);

  useEffect(() => {
    let mounted = true;

    const initializeGoogleButton = () => {
      const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

      if (!mounted || !googleButtonRef.current || !window.google || !googleClientId) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!mounted) return;

          if (!response?.credential) {
            setError('Google did not return a credential. Please try again.');
            return;
          }

          setError('');
          setGoogleLoading(true);

          try {
            const apiResponse = await googleLogin(response.credential);
            onAuthSuccess(apiResponse.data.user);
          } catch (err) {
            const backendMessage =
              typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message;
            const errorMsg = backendMessage || err.message || 'Google login failed. Please try again.';
            setError(errorMsg);
          } finally {
            if (mounted) {
              setGoogleLoading(false);
            }
          }
        },
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 374,
      });
    };

    const existingScript = document.getElementById('google-identity-script');
    if (existingScript) {
      initializeGoogleButton();
    } else {
      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleButton;
      script.onerror = () => {
        setError('Failed to load Google Sign-In script. Check internet connection and try again.');
      };
      document.body.appendChild(script);
    }

    return () => {
      mounted = false;
    };
  }, [onAuthSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password);
      onAuthSuccess(response.data.user);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Login failed. Please try again.';
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b8af7] via-[#3e6ee7] to-[#2f56d0] px-4 py-8 md:py-10">
      <div className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_22px_70px_-20px_rgba(8,31,106,0.62)]">
        <section className="w-full p-6 sm:p-8 md:w-[47%]">
          <div className="mb-8 flex items-center gap-3">
            <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#0f2c86" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" opacity="0.15" />
              <path d="M17 40c3.3-7.4 8.2-11.3 15-11.7 6-.4 10.4 2.3 15 7.7" fill="none" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round"/>
              <rect x="23" y="20" width="20" height="15" rx="3" fill="#1e3a8a" />
              <circle cx="33" cy="27.5" r="3.5" fill="#93c5fd" />
              <path d="M37 39l5 5 8-9" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-[32px] font-bold tracking-tight text-[#1e3a8a] sm:text-[36px]">AI Proctoring</h1>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-[#121a2f] sm:text-[40px]">Sign In</h2>
          <p className="mt-2 text-base text-slate-500 sm:text-lg">Welcome back! Please login to your account.</p>

          {error && (
            <div className="mt-7 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-2 block text-lg font-semibold text-[#1f2937]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none transition focus:border-[#2d62e6] focus:ring-2 focus:ring-[#2d62e6]/20"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-semibold text-[#1f2937]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-700 outline-none transition focus:border-[#2d62e6] focus:ring-2 focus:ring-[#2d62e6]/20"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="h-14 w-full rounded-xl bg-[#2f66eb] text-xl font-semibold text-white transition hover:bg-[#2457d4] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3 text-slate-500">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-lg font-semibold tracking-[0.18em]">OR</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          <div className="mt-6 flex justify-center">
            <div
              ref={googleButtonRef}
              className="min-h-[44px] w-full max-w-[340px] overflow-hidden rounded-xl border border-slate-300 bg-white"
            />
          </div>

          {!process.env.REACT_APP_GOOGLE_CLIENT_ID && (
            <p className="mt-3 text-center text-sm text-amber-700">
              Set REACT_APP_GOOGLE_CLIENT_ID in frontend environment to enable Google Sign-In.
            </p>
          )}

          <p className="mt-6 text-center text-base text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#2f66eb] underline underline-offset-4">
              Register here
            </Link>
          </p>
        </section>

        <section className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#9fbaf9] via-[#5f8af2] to-[#2753d2] md:flex md:w-[54%]">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-white/15 blur-2xl" />
          <div className="relative z-10 w-[84%] rounded-3xl bg-white/20 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mx-auto w-full max-w-lg">
              <svg viewBox="0 0 500 360" className="w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="shield" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#123789" />
                    <stop offset="100%" stopColor="#245fdf" />
                  </linearGradient>
                </defs>
                <circle cx="280" cy="165" r="128" fill="none" stroke="#dbeafe" strokeOpacity="0.8" strokeWidth="18" />
                <circle cx="280" cy="165" r="89" fill="#eff6ff" />
                <path d="M160 142c0-41 33-74 74-74h42v147h-42c-41 0-74-33-74-73z" fill="url(#shield)" />
                <rect x="215" y="170" width="180" height="106" rx="12" fill="#ffffff" stroke="#1d4ed8" strokeWidth="6" />
                <path d="M280 219l18 18 34-38" fill="none" stroke="#2f8f3c" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="386" cy="225" r="34" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="6" />
                <circle cx="386" cy="225" r="13" fill="#dbeafe" />
                <rect x="106" y="259" width="290" height="17" rx="8" fill="#163c95" opacity="0.28" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
