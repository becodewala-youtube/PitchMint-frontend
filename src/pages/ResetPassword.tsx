import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Mail, Key, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          darkMode ? "bg-[#0a0118]" : "bg-gray-50"
        } py-12 px-4 sm:px-6 lg:px-8`}
      >
        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
              darkMode
                ? "bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-fuchsia-600/30"
                : "bg-gradient-to-br from-violet-300/40 via-purple-300/30 to-fuchsia-300/40"
            }`}
            style={{ animationDuration: '8s' }}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
              darkMode
                ? "bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-indigo-600/30"
                : "bg-gradient-to-br from-cyan-300/40 via-blue-300/30 to-indigo-300/40"
            }`}
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
              darkMode
                ? "bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20"
                : "bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-cyan-300/30"
            }`}
            style={{ animationDuration: '12s', animationDelay: '4s' }}
          ></div>

          {/* Mesh Gradient Overlay */}
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
          
          {/* Animated Grid */}
          <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />
        </div>

        {/* Success Card */}
        <div className="relative z-10 max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl shadow-2xl backdrop-blur-xl p-10 border ${
              darkMode
                ? "bg-gray-900/50 border-gray-800/50"
                : "bg-white/80 border-gray-200"
            }`}
          >
            {/* Gradient Glow */}
            <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl ${
              darkMode
                ? "bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"
                : "bg-gradient-to-r from-emerald-300/30 via-teal-300/30 to-cyan-300/30"
            }`} />

            <div className="relative text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl shadow-emerald-500/50 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2
                className={`text-2xl sm:text-3xl font-black mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Password Reset Successfully!
                <span className="inline-block ml-2">✅</span>
              </h2>
              <p
                className={`text-base mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your password has been reset successfully. Redirecting you to login...
              </p>

              {/* Loading Spinner */}
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full backdrop-blur-xl ${
              darkMode
                ? 'bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 border border-emerald-500/20'
                : 'bg-white/60 border border-emerald-200'
            } shadow-lg`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Password reset complete
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        darkMode ? "bg-[#0a0118]" : "bg-gray-50"
      } py-12 px-4 sm:px-6 lg:px-8`}
    >
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-fuchsia-600/30"
              : "bg-gradient-to-br from-violet-300/40 via-purple-300/30 to-fuchsia-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-cyan-600/30 via-blue-600/20 to-indigo-600/30"
              : "bg-gradient-to-br from-cyan-300/40 via-blue-300/30 to-indigo-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20"
              : "bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-cyan-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />
      </div>

      {/* Reset Password Card */}
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl shadow-2xl backdrop-blur-xl p-8 sm:p-10 border ${
            darkMode
              ? "bg-gray-900/50 border-gray-800/50"
              : "bg-white/80 border-gray-200"
          }`}
        >
          {/* Gradient Glow */}
          <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl ${
            darkMode
              ? "bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"
              : "bg-gradient-to-r from-emerald-300/30 via-teal-300/30 to-cyan-300/30"
          }`} />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl shadow-emerald-500/50 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-black mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Reset Password
              <span className="inline-block ml-2">🔐</span>
            </h2>
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter the code from your email and your new password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-5">
            {error && (
              <motion.div
                className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl relative text-sm backdrop-blur-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                  {error}
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email"
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3 text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-2 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"
                  }`}
                />
              </div>
            </div>

            {/* Reset Code Field */}
            <div className="relative group">
              <label
                htmlFor="token"
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Reset Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={formData.token}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="••••••"
                  className={`w-full pl-12 pr-4 py-3 text-sm text-center tracking-widest rounded-xl border outline-none transition-all duration-300 focus:ring-2 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"
                  }`}
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="relative group">
              <label
                htmlFor="newPassword"
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-2 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none group"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className={`h-5 w-5 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative group">
              <label
                htmlFor="confirmPassword"
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-2 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/50 focus:border-emerald-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none group"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={`h-5 w-5 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full group relative flex items-center justify-center gap-2 text-base font-bold py-3.5 rounded-xl transition-all duration-300 shadow-xl overflow-hidden ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-emerald-500/50 text-white"
                  : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:shadow-emerald-500/50 text-white"
              }`}
            >
              {!loading && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600"
                    : "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600"
                }`} />
              )}
              
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Resetting...
                </div>
              ) : (
                <>
                  <span className="relative z-10">Reset Password</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>

            {/* Back to Login Link */}
            <div className={`text-center pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <Link
                to="/login"
                className={`inline-flex items-center text-sm font-bold transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full backdrop-blur-xl ${
            darkMode
              ? 'bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 border border-emerald-500/20'
              : 'bg-white/60 border border-emerald-200'
          } shadow-lg`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Secure password reset
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;