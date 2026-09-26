import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Notification from '../components/Notification';
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'login' | 'signup' | 'forgot'
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [authStage, setAuthStage] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'forgot' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setError(null);
    setSuccessMsg(null);
    setAuthStage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  // Submit Handler (Login or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailToUse = formData.email.trim() || (formData.username.includes('@') ? formData.username.trim() : `${formData.username.trim()}@company.com`);
    const nameToUse = formData.username.trim() || emailToUse.split('@')[0];

    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    if (activeTab === 'login') {
      if (!formData.username.trim() && !formData.email.trim()) {
        setError('Please enter your username or email address.');
        return;
      }

      setLoading(true);
      setAuthStage('Authenticating credentials...');

      try {
        await new Promise((r) => setTimeout(r, 300));
        await login(emailToUse, formData.password);
        
        setAuthStage('Authentication successful! Loading business report creator...');
        await new Promise((r) => setTimeout(r, 300));

        // Direct user immediately to the Main Page for creating business report
        navigate('/create-business');
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
          err?.message ||
          'Authentication failed. Please verify credentials or sign up.'
        );
      } finally {
        setLoading(false);
        setAuthStage('');
      }
    } else if (activeTab === 'signup') {
      if (!formData.username.trim()) {
        setError('Please enter a username.');
        return;
      }
      if (!formData.email.trim()) {
        setError('Please enter an email address.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setLoading(true);
      setAuthStage('Creating your enterprise profile...');

      try {
        await new Promise((r) => setTimeout(r, 300));
        await register(nameToUse, formData.email.trim(), formData.password);

        setAuthStage('Account ready! Loading business report creator...');
        await new Promise((r) => setTimeout(r, 300));

        // Direct user immediately to the Main Page for creating business report
        navigate('/create-business');
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
          err?.message ||
          'Registration could not be completed. Please try another email.'
        );
      } finally {
        setLoading(false);
        setAuthStage('');
      }
    }
  };

  return (
    <div className="w-full max-w-[440px] sm:max-w-[480px]">
      {/* CYAN / TURQUOISE CARD (Exact Match to 2nd Reference Image) */}
      <div className="bg-[#00F2DE] rounded-[36px] sm:rounded-[44px] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,242,222,0.4)] relative">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight text-center leading-tight mb-8">
          {activeTab === 'login' ? 'LOGIN TO YOUR' : 'CREATE YOUR'}{' '}
          <span className="block">ACCOUNT</span>
        </h1>

        {/* Notifications & Progress */}
        {error && (
          <div className="mb-5">
            <Notification type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {successMsg && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-2xl bg-white/80 border border-[#0B2545]/20 text-[#0B2545] text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {authStage && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-2xl bg-white/90 border border-[#0B2545]/20 text-[#0B2545] text-xs font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-[#0B2545] shrink-0" />
            <span>{authStage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-[#0B2545] mb-2 pl-1">
              Username :
            </label>
            <input
              type="text"
              name="username"
              required={activeTab === 'signup'}
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. alexander"
              className="w-full bg-[#F0F4F8] text-[#0B2545] font-medium placeholder-slate-400 rounded-full px-6 py-3 sm:py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]/30 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-[#0B2545] mb-2 pl-1">
              Email Address :
            </label>
            <input
              type="email"
              name="email"
              required={activeTab === 'signup'}
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. name@company.com"
              className="w-full bg-[#F0F4F8] text-[#0B2545] font-medium placeholder-slate-400 rounded-full px-6 py-3 sm:py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]/30 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-[#0B2545] mb-2 pl-1">
              Password :
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#F0F4F8] text-[#0B2545] font-medium placeholder-slate-400 rounded-full pl-6 pr-12 py-3 sm:py-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]/30 transition-all text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B2545] transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Bottom Row: Toggle link and prominent white pill LOGIN Button (Exact Image 2) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Account Toggle Text */}
            <div className="text-xs sm:text-sm text-[#0B2545] font-medium text-center sm:text-left">
              {activeTab === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('signup')}
                    className="font-bold underline hover:opacity-80 transition-opacity cursor-pointer text-[#0B2545]"
                  >
                    Sign Up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="font-bold underline hover:opacity-80 transition-opacity cursor-pointer text-[#0B2545]"
                  >
                    Login now
                  </button>
                </>
              )}
            </div>

            {/* White Pill Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[140px] px-8 py-3.5 bg-white hover:bg-slate-50 active:scale-95 text-[#0B2545] font-black text-base sm:text-lg tracking-wider uppercase rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#0B2545]" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>{activeTab === 'login' ? 'LOGIN' : 'SIGN UP'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
