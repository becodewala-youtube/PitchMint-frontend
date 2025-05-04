// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { loadUser } from '../store/slices/authSlice';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
        // Verify the payment session
        await axios.get(`${API_URL}/api/payment/verify/${sessionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        // Reload user data to get updated premium status
        await dispatch(loadUser() as any);
        
        // Redirect to investors page
        navigate('/investors');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify payment');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    verifyPayment();
  }, [sessionId, dispatch, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-xl font-medium text-red-500">{error}</h3>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Verifying your payment...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
