import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle, Mail, Sparkles, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { darkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
                Check Your Email
                <span className="inline-block ml-2">✉️</span>
              </h2>
              <p
                className={`text-base mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We've sent a password reset link to
              </p>
              <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-8">
                {email}
              </p>

              <Link
                to="/reset-password"
                className={`group relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 shadow-xl overflow-hidden ${
                  darkMode
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-emerald-500/50 text-white"
                    : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:shadow-emerald-500/50 text-white"
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600"
                    : "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600"
                }`} />
                
                <span className="relative z-10">Continue to Reset Password</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setSuccess(false)}
                    className={`font-bold transition-colors ${
                      darkMode
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-emerald-600 hover:text-emerald-500"
                    }`}
                  >
                    Try again
                  </button>
                </p>
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
                  Email sent successfully
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
         
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />
      </div>

      {/* Forgot Password Card */}
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl shadow-2xl backdrop-blur-xl p-8 sm:p-6 border ${
            darkMode
              ? "bg-gray-900/50 border-gray-800/50"
              : "bg-white/80 border-gray-200"
          }`}
        >
          {/* Gradient Glow */}
          <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl ${
            darkMode
              ? "bg-gradient-to-r from-orange-600/20 via-amber-600/20 to-yellow-600/20"
              : "bg-gradient-to-r from-orange-300/30 via-amber-300/30 to-yellow-300/30"
          }`} />

          {/* Header */}
          <div className="relative text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"></div>
                <div className="relative w-8 h-8 rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 shadow-2xl shadow-orange-500/50 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h2
              className={`text-md sm:text-lg font-black mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Forgot Password?
              <span className="inline-block ml-2">🔐</span>
            </h2>
            <p
              className={`text-xs  ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter your email address to receive a password reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-6">
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
                className={`block text-xs font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-3 w-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-2 text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-1 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-orange-500/50 focus:border-orange-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-orange-500/50 focus:border-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !email}
              whileHover={!(loading || !email) ? { scale: 1.02 } : {}}
              whileTap={!(loading || !email) ? { scale: 0.98 } : {}}
              className={`w-full group relative flex items-center justify-center gap-2 text-base font-bold py-2 rounded-xl transition-all duration-300 shadow-xl overflow-hidden ${
                loading || !email
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:shadow-orange-500/50 text-white"
                  : "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 hover:shadow-orange-500/50 text-white"
              }`}
            >
              {!(loading || !email) && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600"
                    : "bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600"
                }`} />
              )}
              
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <span className="relative z-10 text-xs  sm:text-sm">Send Reset Link</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>

            {/* Back to Login Link */}
            <div className={`text-center  pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
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
              ? 'bg-gradient-to-r from-orange-600/10 to-yellow-600/10 border border-orange-500/20'
              : 'bg-white/60 border border-orange-200'
          } shadow-lg`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Secure password recovery
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;