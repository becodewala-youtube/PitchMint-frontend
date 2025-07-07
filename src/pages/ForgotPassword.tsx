import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';

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
            Check Your Email
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            We've sent a password reset code to <strong>{email}</strong>
          </p>
          <Link
            to="/reset-password"
            className="btn-primary btn-primary-blue inline-block"
          >
            Continue to Reset Password
          </Link>
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
            <div className="icon-container icon-orange mx-auto mb-6">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Forgot Password?
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your email to receive a reset code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                placeholder="Enter your email address"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || !email}
              className={`w-full btn-primary btn-primary-orange ${
                (loading || !email) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={!(loading || !email) ? { scale: 1.05 } : {}}
              whileTap={!(loading || !email) ? { scale: 0.95 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2" />
                  Sending...
                </div>
              ) : (
                'Send Reset Code'
              )}
            </motion.button>

            <div className="text-center">
              <Link
                to="/login"
                className={`inline-flex items-center text-sm font-medium ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors duration-300`}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;