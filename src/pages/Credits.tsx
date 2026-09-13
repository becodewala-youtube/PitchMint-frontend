import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRazorpay } from '../hooks/useRazorpay';
import { AppDispatch, RootState } from '../store';

import { motion } from 'framer-motion';
import { CreditCard, Check, Zap, Star, Sparkles, Shield, Clock, Gift, TrendingUp, Wallet, X } from 'lucide-react';
import { 
  fetchCreditPlans, 
  fetchUserCreditsBalance, 
  setError, 
  setPurchasingPlan,
  demoPurchase
} from '../store/slices/creditsSlice';
import { updateUserCredits } from '../store/slices/authSlice';


const Credits = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { plans, error, purchasingPlan, fetchedOnce } = useSelector(
    (state: RootState) => state.credits
  );

  useEffect(() => {
    if (!fetchedOnce) {
      dispatch(fetchCreditPlans());
      dispatch(fetchUserCreditsBalance());
    }
  }, [dispatch, fetchedOnce]);

  const { initiatePayment } = useRazorpay({
    createSessionEndpoint: '/api/credits/create-checkout-session',
    verifyPaymentEndpoint: '/api/credits/verify-payment',
    onSuccess: (data) => {
      dispatch(updateUserCredits(data.credits));
      alert(`Success! You've purchased ${data.purchased} credits.`);
      dispatch(setPurchasingPlan(null));
    },
    onError: (err) => {
      dispatch(setError(err.message || 'Payment failed'));
      dispatch(setPurchasingPlan(null));
    },
    onDismiss: () => {
      dispatch(setPurchasingPlan(null));
    },
    description: (data) => `Purchase ${data.planName}`
  });

  const handlePurchase = async (planId: string) => {
    dispatch(setPurchasingPlan(planId));
    dispatch(setError(null));
    await initiatePayment({ planId });
  };
 const handleDemoPurchase = async (planId: string) => {
  if (!import.meta.env.DEV) return;
  
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
    <div className={`min-h-screen relative overflow-hidden bg-[#0a0118]`}>
      <PageBackground theme="amber" />
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            'bg-gradient-to-br from-blue-600/30 via-cyan-600/20 to-teal-600/30'
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            'bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-fuchsia-600/20'
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:64px_64px]`} />

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
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/50`}>
                <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-md md:text-lg font-black text-white`}>
                  Buy{" "}
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Credits
                  </span>
                </h1>
                <p className={`text-xs  text-gray-400 font-medium flex items-center gap-2 justify-center`}>
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
            className={`mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/30`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm text-red-200`}>{error}</span>
              </div>
              <button 
                onClick={() => dispatch(setError(null))}
                className={`text-sm font-bold text-red-400 hover:text-red-300 transition-colors`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Current Balance Card */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-2 mb-8 bg-gradient-to-r from-amber-600/10 via-yellow-600/10 to-orange-600/10 border border-amber-500/20`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-amber-600/5 via-yellow-600/5 to-orange-600/5 backdrop-blur-3xl`} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-xl">
                <Wallet className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className={`text-sm font-semibold mb-1 text-gray-400`}>
                  Current Balance
                </h2>
                <div className={`text-xl font-black text-white`}>
                  {user?.credits || 0}
                  <span className={`text-xs ml-2 font-bold text-gray-400`}>
                    Credits
                  </span>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/30 border border-green-500/30`}>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className={`text-xs font-semibold text-green-300`}>
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
                className={`group relative overflow-hidden rounded-3xl p-3 bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl hover:scale-105 transition-all duration-500 ${isPopular ? 'ring-2 ring-purple-500/50' : ''}`}
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
                  <h3 className={`text-md font-black mb-1 text-white`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mb-4 text-gray-400 leading-relaxed`}>
                    {plan.description}
                  </p>

                  {/* Credits Display */}
                  <div className={`p-2 rounded-2xl mb-6 bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
                    <div className="text-center">
                      <div className={`text-xl font-black mb-1 text-white`}>
                        {plan.credits}
                      </div>
                      <div className={`text-xs font-semibold text-gray-400`}>
                        Credits
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-xl font-black text-white`}>
                        ₹{(plan.price / 100).toFixed(0)}
                      </span>
                      <span className={`text-xs font-semibold text-gray-400`}>
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
                        <span className={`text-xs text-gray-300`}>
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
                  {import.meta.env.DEV && (
                    <motion.button
                      onClick={() => handleDemoPurchase(plan.id)}
                      disabled={loading || purchasingPlan === plan.id}
                      className={`w-full mt-2 py-1 sm:py-2 px-4 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        'bg-gray-700 hover:bg-gray-600 text-white'
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
          className={`bg-gray-900/50 border border-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-3`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <h2 className={`text-sm sm:text-md font-black text-white`}>
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
              <div key={idx} className={`p-3 rounded-2xl bg-gray-800/50 border border-gray-700`}>
                <h3 className={`text-xs sm:text-sm font-bold mb-2 text-white`}>
                  {faq.question}
                </h3>
                <p className={`text-xs leading-relaxed text-gray-400`}>
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