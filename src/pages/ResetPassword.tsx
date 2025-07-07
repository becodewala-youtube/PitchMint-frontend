import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
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
            Password Reset Successfully!
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Your password has been reset. Redirecting to login...
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
            <div className="icon-container icon-green mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Reset Password
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter the code from your email and new password
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
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                placeholder="Email address"
              />
            </div>

            <div>
              <input
                name="token"
                type="text"
                required
                value={formData.token}
                onChange={handleChange}
                className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'} text-center tracking-widest`}
                placeholder="Reset code"
                maxLength={6}
              />
            </div>

            <div>
              <input
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                placeholder="New password"
              />
            </div>

            <div>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                placeholder="Confirm new password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary btn-primary-green ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2" />
                  Resetting...
                </div>
              ) : (
                'Reset Password'
              )}
            </motion.button>

            <div className="text-center">
              <Link
                to="/login"
                className={`text-sm font-medium ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                } transition-colors duration-300`}
              >
                Back to Login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;