import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Notification from '../components/Notification';
import Logo from '../components/Logo';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Database,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
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
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
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

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setAuthStage('Authenticating credentials...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setAuthStage('Syncing workspace permissions...');
      
      await login(formData.email.trim(), formData.password);
      
      setAuthStage('Authentication successful! Entering dashboard...');
      await new Promise((r) => setTimeout(r, 300));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Authentication failed. Please verify your credentials or sign up.'
      );
    } finally {
      setLoading(false);
      setAuthStage('');
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setError(null);
    setAuthStage('Provisioning Security Node...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setAuthStage('Registering user profile...');

      await register(formData.fullName.trim(), formData.email.trim(), formData.password);

      setAuthStage('Account active! Entering dashboard...');
      await new Promise((r) => setTimeout(r, 300));

      navigate('/dashboard');
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
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.newPassword) {
      setError('Please enter your email and a new password.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setAuthStage('Updating security credentials...');

    try {
      await resetPassword(formData.email.trim(), formData.newPassword);
      setSuccessMsg('Password successfully reset! You can now sign in.');
      setFormData((prev) => ({ ...prev, password: prev.newPassword, newPassword: '' }));
      setTimeout(() => {
        switchTab('login');
      }, 1500);
    } catch (err) {
      setError(err?.message || 'Unable to reset password for this email.');
    } finally {
      setLoading(false);
      setAuthStage('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sleek White Card with Orange Header Accents */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <Logo size="sm" showText={true} subtitle="" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full shadow-xs">
              <Database className="w-2.5 h-2.5 text-orange-600" />
              <span>Database</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-xs">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
              <span>Security</span>
            </div>
          </div>
        </div>

        {/* Card Header & Title with Orange Background & White Text */}
        <div className="text-center p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl text-white mb-6 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {activeTab === 'login' && 'Enterprise Sign In'}
            {activeTab === 'signup' && 'Create Account'}
            {activeTab === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-xs text-orange-100 mt-1 font-medium">
            {activeTab === 'login' && 'Authenticate to enter the autonomous operations workspace.'}
            {activeTab === 'signup' && 'Register your profile to initialize your business intelligence workspace.'}
            {activeTab === 'forgot' && 'Update your login credentials securely in database.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => switchTab('forgot')}
            className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === 'forgot'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Notifications & Progress */}
        {error && (
          <div className="mb-4">
            <Notification type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {authStage && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-orange-600 shrink-0" />
            <span>{authStage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="analyst@enterprise.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="text-xs text-orange-600 hover:text-orange-700 transition-colors font-bold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying & Entering...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Alex Vance"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="analyst@enterprise.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving & Launching Workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD FORM */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="analyst@enterprise.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new strong password"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Updating Database...</span>
                </>
              ) : (
                <>
                  <span>Save Password & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
