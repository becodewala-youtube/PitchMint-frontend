import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard, Check, Zap, Star, Sparkles, Shield, Clock, Gift, TrendingUp, Wallet, X } from 'lucide-react';
import { 
  fetchCreditPlans, 
  fetchUserCreditsBalance, 
  setError, 
  setPurchasingPlan,
  updateUserCredits,
  demoPurchase
} from '../store/slices/creditsSlice';
import axios from 'axios';
import { API_URL } from '../utils/constants';

declare global {
  interface Window {
    Razorpay: any;
  }
}


const Credits = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
const { plans, userCredits, loading, error, purchasingPlan, fetchedOnce } = useSelector(
  (state: RootState) => state.credits
);

useEffect(() => {
  if (!fetchedOnce) {
    dispatch(fetchCreditPlans());
    dispatch(fetchUserCreditsBalance());
  }
  
  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;

  script.onerror = () => dispatch(setError('Failed to load payment gateway'));
  document.body.appendChild(script);
  
  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
}, [dispatch, fetchedOnce]);




  const handlePurchase = async (planId: string) => {
  if (!window.Razorpay) {
    dispatch(setError('Payment gateway not loaded. Please refresh the page.'));
    return;
  }

  dispatch(setPurchasingPlan(planId));
  dispatch(setError(null));

  try {
    const response = await axios.post(
      `${API_URL}/api/credits/create-checkout-session`,
      { planId },
      { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );

    const { orderId, amount, currency, keyId, planName, userEmail, userName } = response.data;

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
          const verifyResponse = await axios.post(
            `${API_URL}/api/credits/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 15000
            }
          );
          
          dispatch(updateUserCredits(verifyResponse.data.credits));
          alert(`Success! You've purchased ${verifyResponse.data.purchased} credits.`);
          
        } catch (verifyError: any) {
          console.error('Payment verification failed:', verifyError);
          dispatch(setError(
            verifyError.response?.data?.message || 
            'Payment verification failed. Please contact support if amount was debited.'
          ));
        } finally {
          dispatch(setPurchasingPlan(null));
        }
      },
      modal: {
        ondismiss: function() {
          dispatch(setPurchasingPlan(null));
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      dispatch(setError(`Payment failed: ${response.error.description}`));
      dispatch(setPurchasingPlan(null));
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
    
    dispatch(setError(errorMessage));
    dispatch(setPurchasingPlan(null));
  }
};
 const handleDemoPurchase = async (planId: string) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  dispatch(setPurchasingPlan(planId));
  
  try {
    const result = await dispatch(demoPurchase(planId)).unwrap();
    dispatch(updateUserCredits(result.credits));
    alert(`Demo: Successfully added ${result.purchased} credits!`);
  } catch (error: any) {
    dispatch(setError(error));
  }
};

  const planArray = Object.entries(plans).map(([id, plan]) => ({ id, ...plan }));

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-amber-600/30 via-yellow-600/20 to-orange-600/30"
              : "bg-gradient-to-br from-amber-300/40 via-yellow-300/30 to-orange-300/40"
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
              ? "bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-fuchsia-600/20"
              : "bg-gradient-to-br from-purple-300/30 via-pink-300/20 to-fuchsia-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-amber-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-amber-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-amber-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[25%] w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-center">
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl ${darkMode ? "shadow-amber-500/50" : "shadow-amber-500/30"}`}>
                <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-md md:text-lg font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Buy{" "}
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Credits
                  </span>
                </h1>
                <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                  Power up your startup journey
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className={`mb-6 p-4 rounded-2xl ${darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</span>
              </div>
              <button 
                onClick={() => dispatch(setError(null))}
                className={`text-sm font-bold ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Current Balance Card */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-2 mb-8 ${darkMode ? 'bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-orange-600/10 border border-amber-500/20' : 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 border border-amber-200'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-amber-600/5 via-yellow-600/5 to-orange-600/5' : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50'} backdrop-blur-3xl`} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-xl">
                <Wallet className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current Balance
                </h2>
                <div className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userCredits}
                  <span className={`text-xs ml-2 font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Credits
                  </span>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-green-900/30 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className={`text-xs font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                Available Now
              </span>
            </div>
          </div>
        </motion.div>

        {/* Credit Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {planArray.map((plan, index) => {
            const isPopular = plan.id === 'pro';
            const gradientColors = {
              starter: { from: 'from-blue-600', to: 'to-cyan-600', bg: 'from-blue-600/10 to-cyan-600/10', border: 'border-blue-500/20' },
              pro: { from: 'from-purple-600', to: 'to-pink-600', bg: 'from-purple-600/10 to-pink-600/10', border: 'border-purple-500/20' },
              ultimate: { from: 'from-amber-600', to: 'to-orange-600', bg: 'from-amber-600/10 to-orange-600/10', border: 'border-amber-500/20' }
            };
            
            const colors = gradientColors[plan.id as keyof typeof gradientColors] || gradientColors.starter;
            
            return (
              <motion.div
                key={plan.id}
                className={`group relative overflow-hidden rounded-3xl p-3 ${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl hover:scale-105 transition-all duration-500 ${isPopular ? 'ring-2 ring-purple-500/50' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                    Popular
                  </div>
                )}

                {/* Gradient Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${colors.from} ${colors.to} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                <div className="relative">
                  {/* Plan Icon */}
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {plan.id === 'starter' ? <Zap className="w-4 h-4 text-white" /> :
                     plan.id === 'pro' ? <Star className="w-4 h-4 text-white" /> :
                     <Sparkles className="w-4 h-4 text-white" />}
                  </div>

                  {/* Plan Name */}
                  <h3 className={`text-md font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                    {plan.description}
                  </p>

                  {/* Credits Display */}
                  <div className={`p-2 rounded-2xl mb-6 ${darkMode ? `bg-gradient-to-br ${colors.bg} border ${colors.border}` : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="text-center">
                      <div className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plan.credits}
                      </div>
                      <div className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Credits
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{(plan.price / 100).toFixed(0)}
                      </span>
                      <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        one-time
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 space-y-2">
                    {[
                      { icon: Zap, text: 'Instant credit delivery' },
                      { icon: Clock, text: 'No expiration' },
                      { icon: Shield, text: 'All premium features' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className={`w-4 h-4 rounded-lg bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center mr-3`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  <motion.button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading || purchasingPlan === plan.id}
                    className={`w-full py-1 sm:py-2 px-6 rounded-xl text-xs font-bold text-white transition-all duration-300 ${
                      loading || purchasingPlan === plan.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${colors.from} ${colors.to} hover:shadow-xl`
                    }`}
                    whileHover={!(loading || purchasingPlan === plan.id) ? { scale: 1.02 } : {}}
                    whileTap={!(loading || purchasingPlan === plan.id) ? { scale: 0.98 } : {}}
                  >
                    {purchasingPlan === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Processing...
                      </div>
                    ) : (
                      'Purchase Credits'
                    )}
                  </motion.button>

                  {/* Demo Button */}
                  {process.env.NODE_ENV === 'development' && (
                    <motion.button
                      onClick={() => handleDemoPurchase(plan.id)}
                      disabled={loading || purchasingPlan === plan.id}
                      className={`w-full mt-2 py-1 sm:py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      } ${(loading || purchasingPlan === plan.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      whileHover={!(loading || purchasingPlan === plan.id) ? { scale: 1.02 } : {}}
                    >
                      Demo Purchase (Dev Only)
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div 
          className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-3`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <h2 className={`text-sm sm:text-md font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'How do credits work?',
                answer: 'Each AI-powered feature (idea validation, pitch deck generation, etc.) costs 1 credit. Free users get 3 credits monthly.'
              },
              {
                question: 'Do credits expire?',
                answer: 'No! Purchased credits never expire. Only the monthly free credits reset each month.'
              },
              {
                question: 'Can I get a refund?',
                answer: 'We offer refunds within 7 days of purchase if you haven\'t used any of the credits.'
              },
              {
                question: 'Is payment secure?',
                answer: 'Yes! All payments are processed securely through Razorpay with industry-standard encryption.'
              }
            ].map((faq, idx) => (
              <div key={idx} className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <h3 className={`text-xs sm:text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {faq.question}
                </h3>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Credits;