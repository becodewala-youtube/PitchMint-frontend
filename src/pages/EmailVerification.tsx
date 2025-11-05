import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { verifyEmail } from '../store/slices/authSlice'; // ✅ Import the action

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Use Redux action instead of direct axios call
      const result = await dispatch(verifyEmail({ 
        email, 
        token: verificationCode 
      }) as any);

      if (result.error) {
        // Verification failed
        setError(result.payload || 'Verification failed');
        setLoading(false);
      } else {
        // Verification successful
        setSuccess(true);
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/auth/resend-verification`, { email });
      // Show success message (you might want to add a success state)
      alert('Verification code resent successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${
        darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl shadow-2xl backdrop-blur-xl p-8 text-center max-w-md w-full border ${
            darkMode
              ? 'bg-gray-900/50 border-gray-800/50'
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Verified!
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Your email has been successfully verified. Redirecting to dashboard...
          </p>
          <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen flex items-center justify-center py-12 px-4 ${
      darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'
    }`}>
      {/* Animated Background */}
      
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`rounded-3xl shadow-2xl backdrop-blur-xl p-4 border ${
            darkMode
              ? 'bg-gray-900/50 border-gray-800/50'
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="text-center mb-4">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-1 flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
              Verify Your Email
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We've sent a verification code to
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <motion.div 
                className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="code" className="sr-only">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`w-full px-4 py-1 text-center text-md tracking-widest rounded-xl border outline-none transition-all duration-300 focus:ring-2 ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-violet-500/50 focus:border-violet-500/50'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-violet-500/50 focus:border-violet-500'
                }`}
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className={`w-full py-2 text-sm rounded-xl font-bold text-white transition-all duration-300 shadow-xl ${
                (loading || verificationCode.length !== 6)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/50'
              }`}
              whileHover={!(loading || verificationCode.length !== 6) ? { scale: 1.02 } : {}}
              whileTap={!(loading || verificationCode.length !== 6) ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </motion.button>

            <div className="text-center pt-1">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Didn't receive the code?
              </p>
              <motion.button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className={`text-blue-500 text-sm hover:text-blue-400 font-medium inline-flex items-center gap-1 ${
                  resendLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!resendLoading ? { scale: 1.05 } : {}}
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Resend Code
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerification;