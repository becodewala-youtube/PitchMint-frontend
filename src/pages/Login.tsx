import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';
import { RootState } from '../store';

import { Eye, EyeOff, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleSignIn from '../components/GoogleSignIn';
import AuthLayout from '../components/layout/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    const result = await dispatch(login({ email, password }));
    
    if (result.error && result.payload?.emailNotVerified) {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } else if (!result.error) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = () => {
    navigate('/dashboard');
  };

  const handleGoogleError = (error: string) => {
    setLocalError(error);
  };

  return (
    <AuthLayout theme="violet">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl shadow-2xl backdrop-blur-xl py-4 px-6 sm:py-3 sm:px-8  border ${
            'bg-gray-900/50 border-gray-800/50'
          }`}
        >
          {/* Gradient Glow */}
          <div className={`absolute -inset-1 rounded-3xl opacity-50 blur-2xl ${
            'bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20'
          }`} />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="flex justify-center mb-1">
              <div className="w-16 h-12 rounded-2xl  flex items-center justify-center">
                <img src={Icon} alt="login logo" className="w-8 h-8" />
              </div>
            </div>
            <h2
              className={`text-md sm:text-md font-black sm:mb-1 ${
                'text-white'
              }`}
            >
              Welcome Back
           
            </h2>
            <p
              className={`text-xs  ${
                'text-gray-400'
              }`}
            >
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form className="relative space-y-4" onSubmit={handleSubmit}>
            {(error || localError) && (
              <motion.div
                className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl relative text-sm backdrop-blur-sm"
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                  {error || localError}
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email-address"
                className={`block text-xs font-semibold mb-2 ${
                  'text-gray-300'
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-3 w-3 text-gray-500`} />
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
                    'bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label
                htmlFor="password"
                className={`block text-xs font-semibold mb-2 ${
                  'text-gray-300'
                }`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-3 w-3 text-gray-500`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all duration-300 focus:ring-1 ${
                    'bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none group"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 text-gray-500 group-hover:text-gray-400 transition-colors`} />
                  ) : (
                    <Eye className={`h-5 w-5 text-gray-500 group-hover:text-gray-400 transition-colors`} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className={`text-xs font-semibold transition-colors duration-300 ${
                  'text-violet-400 hover:text-violet-300'
                }`}
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full group relative flex items-center justify-center gap-2 text-base font-bold py-1 sm:py-2 rounded-xl transition-all duration-300 shadow-xl overflow-hidden ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-violet-500/50 text-white'
              }`}
            >
              {!loading && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600'
                }`} />
              )}
              
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <span className="relative z-10 text-xs sm:text-sm">Sign in</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full h-px ${
                    'bg-gradient-to-r from-transparent via-gray-700 to-transparent'
                  }`}
                />
              </div>
              <div className="relative flex justify-center text-xs">
                <span
                  className={`px-4 font-semibold ${
                    'bg-gray-900/50 text-gray-400'
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

            {/* Sign Up Redirect */}
            <div className={`text-center pt-3 border-t border-gray-800`}>
              <p
                className={`text-xs ${
                  'text-gray-400'
                }`}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className={`font-bold transition-colors inline-flex items-center gap-1 ${
                    'text-violet-400 hover:text-violet-300'
                  }`}
                >
                  Sign up
                  <Sparkles className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

      </AuthLayout>
  );
};

export default Login;