import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { RootState } from '../store';
import { Eye, EyeOff, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import GoogleSignIn from '../components/GoogleSignIn';
import Icon from '../assets/icon.png'

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [localError, setLocalError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setLocalError('');
    const result = await dispatch(register({ name, email, password }) as any);
    if (!result.error) {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    }
  };

  const handleGoogleSuccess = () => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 100);
  };

  const handleGoogleError = (error: string) => {
    setLocalError(error);
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        darkMode ? "bg-[#0a0118]" : "bg-gray-50"
      } py-8 px-4 sm:px-6 lg:px-8`}
    >
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />
      </div>

      {/* Sign Up Card */}
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl shadow-2xl backdrop-blur-xl py-4 px-6 sm:py-3 sm:px-8 border ${
            darkMode
              ? "bg-gray-900/50 border-gray-800/50"
              : "bg-white/80 border-gray-200"
          }`}
        >
          {/* Gradient Glow */}
          <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl ${
            darkMode
              ? "bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20"
              : "bg-gradient-to-r from-violet-300/30 via-purple-300/30 to-fuchsia-300/30"
          }`} />

          {/* Header */}
          <div className="relative text-center mb-6">
            <div className="flex justify-center mb-1">
              <div className="w-16 h-12 rounded-2xl  flex items-center justify-center">
                <img src={Icon} alt="signup logo" className="w-8 h-8" />
              </div>
            </div>
            <h2
              className={`text-md sm:text-md font-black sm:mb-1 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Create Your Account
             
            </h2>
            <p
              className={`text-xs  ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Start your journey with us today
            </p>
          </div>

          {/* Form */}
          <form className="relative space-y-4" onSubmit={handleSubmit}>
            {(error || passwordError || localError) && (
              <motion.div
                className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl relative text-sm backdrop-blur-sm"
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                  {error || passwordError || localError}
                </div>
              </motion.div>
            )}

            {/* Full Name Field */}
            <div className="relative group">
              <label
                htmlFor="name"
                className={`block text-xs
                   font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className={`h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-1 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500/50 focus:border-violet-500"
                  }`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email-address"
                className={`block text-xs font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-1 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500/50 focus:border-violet-500"
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label
                htmlFor="password"
                className={`block text-xs font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-1 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500/50 focus:border-violet-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none group"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className={`h-4 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  ) : (
                    <Eye className={`h-4 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative group">
              <label
                htmlFor="confirm-password"
                className={`block text-xs font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm Password
              </label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12  py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-1 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500/50 focus:border-violet-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none group"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={`h-4 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  ) : (
                    <Eye className={`h-4 ${darkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'} transition-colors`} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className={`p-3 rounded-xl backdrop-blur-sm ${
                darkMode 
                  ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20' 
                  : 'bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <CheckCircle className={`w-4 h-4 ${password.length >= 8 ? 'text-emerald-500' : darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <span className={password.length >= 8 ? 'text-emerald-500' : darkMode ? 'text-gray-500' : 'text-gray-600'}>
                    At Least 8 characters password
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full group relative flex items-center justify-center gap-2 text-base font-bold py-1 sm:py-2 rounded-xl transition-all duration-300 shadow-xl overflow-hidden ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-violet-500/50 text-white"
                  : "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 hover:shadow-cyan-500/50 text-white"
              }`}
            >
              {!loading && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600"
                    : "bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600"
                }`} />
              )}
              
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <>
                  <span className="relative z-10 text-xs sm:text-sm">Create Account</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full h-px ${
                    darkMode 
                      ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent" 
                      : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                  }`}
                />
              </div>
              <div className="relative flex justify-center text-xs">
                <span
                  className={`px-4 font-semibold ${
                    darkMode
                      ? "bg-gray-900/50 text-gray-400"
                      : "bg-white/80 text-gray-600"
                  }`}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <GoogleSignIn
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Sign In Redirect */}
            <div className={`text-center pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-bold transition-colors inline-flex items-center gap-1 ${
                    darkMode
                      ? "text-violet-400 hover:text-violet-300"
                      : "text-violet-600 hover:text-violet-500"
                  }`}
                >
                  Sign in
                  <Sparkles className="w-4 h-4" />
                </Link>
              </p>
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
              ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20'
              : 'bg-white/60 border border-violet-200'
          } shadow-lg`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Secure & encrypted connection
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;