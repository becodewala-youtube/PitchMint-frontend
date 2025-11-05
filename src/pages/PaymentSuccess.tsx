import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { loadUser } from '../store/slices/authSlice';
import { AlertCircle, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          throw new Error('No session ID found');
        }
        const token = localStorage.getItem('token');
        
        // Check if this is a credit purchase or premium upgrade
        const response = await axios.get(`${API_URL}/api/payment/verify/${sessionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
        // Reload user data to get updated premium status
        await dispatch(loadUser() as any);
        
        // Redirect based on payment type
        const paymentType = response.data.type;
        if (paymentType === 'credit_purchase') {
          navigate('/credits');
        } else {
          navigate('/investors');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify payment');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    verifyPayment();
  }, [sessionId, dispatch, navigate]);

  if (error) {
    return (
      <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'} flex items-center justify-center`}>
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
              darkMode
                ? "bg-gradient-to-br from-red-600/30 via-pink-600/20 to-rose-600/30"
                : "bg-gradient-to-br from-red-300/40 via-pink-300/30 to-rose-300/40"
            }`}
            style={{ animationDuration: '8s' }}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
              darkMode
                ? "bg-gradient-to-br from-orange-600/30 via-red-600/20 to-pink-600/30"
                : "bg-gradient-to-br from-orange-300/40 via-red-300/30 to-pink-300/40"
            }`}
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          ></div>
        </div>

        <motion.div 
          className={`relative z-10 text-center p-12 rounded-3xl ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl shadow-2xl max-w-md mx-4`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <AlertCircle className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className={`text-2xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Payment Verification Failed
          </h3>
          <p className={`text-sm mb-6 ${darkMode ? 'text-red-300' : 'text-red-600'} font-semibold`}>
            {error}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Redirecting to dashboard...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'} flex items-center justify-center`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-green-600/30 via-emerald-600/20 to-teal-600/30"
              : "bg-gradient-to-br from-green-300/40 via-emerald-300/30 to-teal-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-blue-600/30 via-cyan-600/20 to-teal-600/30"
              : "bg-gradient-to-br from-blue-300/40 via-cyan-300/30 to-teal-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20"
              : "bg-gradient-to-br from-indigo-300/30 via-purple-300/20 to-pink-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-green-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-green-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Success Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        className={`relative z-10 text-center p-12 rounded-3xl ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl shadow-2xl max-w-md mx-4`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon with Animation */}
        <motion.div 
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {/* Animated Rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          
          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-2"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
          </motion.div>
        </motion.div>

        <motion.h3 
          className={`text-3xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Verifying Payment
        </motion.h3>
        
        <motion.p 
          className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Please wait while we confirm your payment...
        </motion.p>

        {/* Loading Animation */}
        <motion.div 
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex gap-2">
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className={`mt-8 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;