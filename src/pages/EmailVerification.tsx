import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';

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
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        email,
        token: verificationCode
      });

      setSuccess(true);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/auth/resend-verification`, { email });
      setError('');
      // Show success message
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'} flex items-center justify-center py-12 px-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 text-center max-w-md w-full`}
        >
          <div className="icon-container-lg bg-green-500 mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Verified!
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Your email has been successfully verified. Redirecting to dashboard...
          </p>
          <div className="loading-spinner mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'} flex items-center justify-center py-12 px-4`}>
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
        >
          <div className="text-center mb-8">
            <div className="icon-container icon-blue mx-auto mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Verify Your Email
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We've sent a verification code to
            </p>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <motion.div 
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl"
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
                className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'} text-center text-2xl tracking-widest`}
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className={`w-full btn-primary btn-primary-blue ${
                (loading || verificationCode.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={!(loading || verificationCode.length !== 6) ? { scale: 1.05 } : {}}
              whileTap={!(loading || verificationCode.length !== 6) ? { scale: 0.95 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2" />
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </motion.button>

            <div className="text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Didn't receive the code?
              </p>
              <motion.button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className={`text-blue-600 hover:text-blue-500 font-medium ${
                  resendLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={!resendLoading ? { scale: 1.05 } : {}}
              >
                {resendLoading ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Resending...
                  </div>
                ) : (
                  'Resend Code'
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