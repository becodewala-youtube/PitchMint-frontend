import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/hooks';
import { signin, clearError } from '@/features/auth/store/authSlice';
import { RootState } from '@/app/store';

import { Eye, EyeOff, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleSignIn from '@/features/auth/components/GoogleSignIn';
import AuthLayout from '@/shared/components/layout/AuthLayout';
import Icon from '@/assets/icons/icon.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error || localError) {
      const timer = setTimeout(() => {
        if (error) {
          dispatch(clearError());
        }
        if (localError) {
          setLocalError('');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, localError, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    const result = (await dispatch(signin({ email, password }))) as any;
    
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[20px] border border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl p-5 sm:px-6 sm:py-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative z-10 w-full"
        >

          {/* Header */}
          <div className="relative text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#141414] border border-white/5 shadow-inner">
                <img src={Icon} alt="sign in logo" className="w-4 h-4" />
              </div>
            </div>
            <h2 className="text-[18px] font-semibold tracking-tight text-white mb-0.5">
              Welcome Back
            </h2>
            <p className="text-[12px] text-gray-400">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form className="relative space-y-2.5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {(error || localError) && (
                <motion.div
                  key="error-box"
                  className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl relative text-sm backdrop-blur-sm"
                  role="alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                    {error || localError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email-address"
                className="block text-[11px] font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3 w-3 text-gray-500" />
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
                  className="w-full pl-8 pr-3 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label
                htmlFor="password"
                className="block text-[11px] font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3 w-3 text-gray-500" />
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
                  className="w-full pl-8 pr-8 py-1.5 bg-[#141414] border border-white/10 rounded-lg text-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none group"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 text-gray-500 group-hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-3 w-3 text-gray-500 group-hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[10px] font-semibold text-gray-400 hover:text-white transition-colors duration-300"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full group py-1.5 mt-3 ${
                loading
                  ? "flex items-center justify-center bg-[#141414] border border-white/10 text-gray-500 cursor-not-allowed rounded-xl shadow-none"
                  : "btn-primary"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span className="text-[12px]">Signing in...</span>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-[12px]">Sign in</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-white/10" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-2 font-medium text-gray-500 bg-[#0a0a0a]">
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
            <div className="text-center pt-3 border-t border-white/5 mt-3">
              <p className="text-[11px] text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-white hover:text-gray-200 transition-colors inline-flex items-center gap-1 border-b border-gray-500 hover:border-gray-300 pb-[1px]"
                >
                  Sign up
                  <Sparkles className="w-2.5 h-2.5" />
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

      </AuthLayout>
  );
};

export default Signin;