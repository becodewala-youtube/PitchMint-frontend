import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard, Check, Zap, Star, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CreditPlan {
  name: string;
  credits: number;
  price: number;
  description: string;
}

interface CreditPlans {
  [key: string]: CreditPlan;
}

const Credits = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();
  const [plans, setPlans] = useState<CreditPlans>({});
  const [loading, setLoading] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState(user?.credits || 0);

  useEffect(() => {
    fetchPlans();
    fetchUserCredits();
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onerror = () => setError('Failed to load payment gateway');
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/credits/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlans(response.data);
    } catch (error: any) {
      console.error('Failed to fetch plans:', error);
      setError('Failed to load credit plans');
    }
  };

  const fetchUserCredits = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserCredits(response.data.credits);
    } catch (error: any) {
      console.error('Failed to fetch user credits:', error);
    }
  };

  const handlePurchase = async (planId: string) => {
    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    setPurchasingPlan(planId);
    setLoading(true);
    setError(null);

    try {
      // Create Razorpay order
   
      const response = await axios.post(
        `${API_URL}/api/credits/create-checkout-session`,
        { planId },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 second timeout
        }
      );

     
      const { orderId, amount, currency, keyId, planName, userEmail, userName } = response.data;

      // Razorpay checkout options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'PitchMint',
        description: `Purchase ${planName}`,
        order_id: orderId,
        prefill: {
          name: userName || user?.name || '',
          email: userEmail || user?.email || '',
        },
        theme: {
          color: '#8B5CF6'
        },
        handler: async function (response: any) {
          
          try {
            setLoading(true);
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${API_URL}/api/credits/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { 
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000 // 15 second timeout for verification
              }
            );
            
            
            
            // Update local state
            setUserCredits(verifyResponse.data.credits);
            
            // Show success message
            alert(`Success! You've purchased ${verifyResponse.data.purchased} credits.`);
            
          } catch (verifyError: any) {
            console.error('Payment verification failed:', verifyError);
            setError(
              verifyError.response?.data?.message || 
              'Payment verification failed. Please contact support if amount was debited.'
            );
          } finally {
            setLoading(false);
            setPurchasingPlan(null);
          }
        },
        modal: {
          ondismiss: function() {
           
            setLoading(false);
            setPurchasingPlan(null);
          }
        }
      };

      
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
        setPurchasingPlan(null);
      });

      rzp.open();

    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      let errorMessage = 'Purchase failed. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      setLoading(false);
      setPurchasingPlan(null);
    }
  };

  // Demo purchase function for development
  const handleDemoPurchase = async (planId: string) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    setPurchasingPlan(planId);
    setLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/api/credits/simulate-payment-success`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserCredits(response.data.credits);
      alert(`Demo: Successfully added ${response.data.purchased} credits!`);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Demo purchase failed');
    } finally {
      setLoading(false);
      setPurchasingPlan(null);
    }
  };

  const planArray = Object.entries(plans).map(([id, plan]) => ({ id, ...plan }));

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-container">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="icon-container icon-yellow mx-auto mb-2">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Buy
              <span className="ml-2 text-gradient-yellow">
                Credits
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Power up your startup journey with more credits
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-between items-start">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}

          {/* Current Balance */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-2 mb-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Balance
            </h2>
            <div className={`text-2xl font-bold mb-1 text-gradient-yellow`}>
              {userCredits}
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Credits Available
            </p>
          </motion.div>

          {/* Credit Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planArray.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover py-6  px-4 text-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-hover-effect"></div>
                <div className="relative">
                  {/* Plan Icon */}
                  <div className={`icon-container-md mx-auto mb-4 ${
                    plan.id === 'starter' ? 'icon-blue' :
                    plan.id === 'pro' ? 'btn-primary-red' : 'icon-yellow'
                  }`}>
                    {plan.id === 'starter' ? <Zap className="h-6 w-6 text-white" /> :
                     plan.id === 'pro' ? <Star className="h-6 w-6 text-white" /> :
                     <Sparkles className="h-6 w-6 text-white" />}
                  </div>

                  {/* Plan Details */}
                  <h3 className={`text-lg font-bold  ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {plan.description}
                  </p>

                  {/* Credits */}
                  <div className="mb-6">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {plan.credits}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Credits
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{(plan.price / 100).toFixed(0)}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      One-time payment
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-2">
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Instant credit delivery
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        No expiration
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        All premium features
                      </span>
                    </div>
                  </div>

                  {/* Purchase Buttons */}
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => handlePurchase(plan.id)}
                      disabled={loading || purchasingPlan === plan.id}
                      className={`w-full btn-primary ${
                        plan.id === 'starter' ? 'btn-primary-blue' :
                        plan.id === 'pro' ? 'btn-primary-red' : 'btn-primary-yellow'
                      } ${(loading || purchasingPlan === plan.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      whileHover={!(loading || purchasingPlan === plan.id) ? { scale: 1.05 } : {}}
                      whileTap={!(loading || purchasingPlan === plan.id) ? { scale: 0.95 } : {}}
                    >
                      {purchasingPlan === plan.id ? (
                        <div className="flex items-center justify-center">
                          <div className="loading-spinner mr-2" />
                          Processing...
                        </div>
                      ) : (
                        'Purchase Credits'
                      )}
                    </motion.button>

                    {/* Demo Button for Development */}
                    {process.env.NODE_ENV === 'development' && (
                      <motion.button
                        onClick={() => handleDemoPurchase(plan.id)}
                        disabled={loading || purchasingPlan === plan.id}
                        className="w-full btn-primary btn-primary-gray text-sm py-2"
                        whileHover={!(loading || purchasingPlan === plan.id) ? { scale: 1.02 } : {}}
                      >
                        Demo Purchase (Dev Only)
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 px-6 mt-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className={`text-lg font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className={`font-bold  mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  How do credits work?
                </h3>
                <p className={` text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Each AI-powered feature (idea validation, pitch deck generation, etc.) costs 1 credit. Free users get 3 credits monthly.
                </p>
              </div>
              
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Do credits expire?
                </h3>
                <p className={` text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No! Purchased credits never expire. Only the monthly free credits reset each month.
                </p>
              </div>
              
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Can I get a refund?
                </h3>
                <p className={` text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We offer refunds within 7 days of purchase if you haven't used any of the credits.
                </p>
              </div>
              
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Is payment secure?
                </h3>
                <p className={`  text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Yes! All payments are processed securely through Razorpay with industry-standard encryption.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Credits;