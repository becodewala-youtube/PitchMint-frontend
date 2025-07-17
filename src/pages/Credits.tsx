import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { CreditCard, Check, Zap, Star, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

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

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/credits/plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans');
      setError('Failed to load credit plans');
    }
  };

const handlePurchase = async (planId: string) => {
  setPurchasingPlan(planId);
  setLoading(true);
  setError(null);

  try {
    const response = await axios.post(
      `${API_URL}/api/credits/purchase`,
      { planId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { clientSecret, paymentIntentId } = response.data;

    if (!clientSecret || !paymentIntentId) {
      throw new Error('Failed to create payment intent');
    }

    // DEMO MODE: Simulate successful payment processing
    // In production, you would use Stripe Elements here
    console.log('Demo: Simulating payment processing...');
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // DEMO: Simulate successful payment by updating the payment intent
        // In production, Stripe would handle this automatically
        await axios.post(
          `${API_URL}/api/credits/simulate-payment-success`,
          { paymentIntentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Now confirm the purchase
        const confirmResponse = await axios.post(
          `${API_URL}/api/credits/confirm-purchase`,
          { paymentIntentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (confirmResponse.data.credits) {
          // Update local user data and reload
          const updatedUser = { 
            ...JSON.parse(localStorage.getItem('user') || '{}'), 
            credits: confirmResponse.data.credits 
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.location.reload();
        }
      } catch (confirmError: any) {
        console.error('Payment confirmation failed:', confirmError);
        setError(confirmError.response?.data?.message || 'Payment confirmation failed');
      } finally {
        setLoading(false);
        setPurchasingPlan(null);
      }
    }, 2000);

  } catch (error: any) {
    console.error('Purchase failed:', error);
    setError(error.response?.data?.message || error.message || 'Purchase failed');
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
            <div className="icon-container icon-yellow mx-auto mb-8">
              <CreditCard className="h-6 w-6 text-white" />
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
              {error}
            </motion.div>
          )}

          {/* Current Balance */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 mb-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Balance
            </h2>
            <div className={`text-4xl font-bold mb-4 text-gradient-yellow`}>
              {user?.credits || 0}
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Credits Available
            </p>
          </motion.div>

          {/* Credit Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planArray.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`group card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-8 text-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-hover-effect"></div>
                <div className="relative">
                  {/* Plan Icon */}
                  <div className={`icon-container-lg mx-auto mb-6 ${
                    plan.id === 'starter' ? 'icon-blue' :
                    plan.id === 'pro' ? 'btn-primary-red' : 'icon-yellow'
                  }`}>
                    {plan.id === 'starter' ? <Zap className="h-12 w-12 text-white" /> :
                     plan.id === 'pro' ? <Star className="h-12 w-12 text-white" /> :
                     <Sparkles className="h-12 w-12 text-white" />}
                  </div>

                  {/* Plan Details */}
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    {plan.description}
                  </p>

                  {/* Credits */}
                  <div className="mb-6">
                    <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {plan.credits}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Credits
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${(plan.price / 100).toFixed(2)}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      One-time payment
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
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

                  {/* Purchase Button */}
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
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo Notice */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6 mt-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Demo Mode
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This is a demo. In production, this would integrate with Stripe for secure payments.
              </p>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 px-6 mt-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className={`text-xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                  Yes! All payments are processed securely through Stripe with industry-standard encryption.
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