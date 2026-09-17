import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { useRazorpay } from '../hooks/useRazorpay';
import { RootState } from '../store';

import { 
  CreditCard, 
  Check, 
  Zap, 
  Star, 
  Sparkles, 
  Shield, 
  Clock, 
  Gift, 
  TrendingUp, 
  Wallet, 
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
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
  const dispatch = useAppDispatch();
  const { plans, loading: creditsLoading, error, purchasingPlan, fetchedOnce } = useSelector(
    (state: RootState) => state.credits
  );

  useEffect(() => {
    if (!fetchedOnce) {
      dispatch(fetchCreditPlans());
      dispatch(fetchUserCreditsBalance());
    }
  }, [dispatch, fetchedOnce]);

  const { initiatePayment, loading: paymentLoading } = useRazorpay({
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

  const loading = creditsLoading || paymentLoading;

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
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <CreditCard className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Buy Credits
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Power up your startup validation and pitch deck tools
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-[12px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => dispatch(setError(null))} 
              className="text-red-400 hover:text-red-300 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Current Balance Card */}
        <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-gray-400">Current Balance</div>
              <div className="text-[20px] font-bold text-white tracking-tight leading-tight">
                {user?.credits || 0} <span className="text-[11px] font-normal text-gray-400">Credits</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Available Now</span>
          </div>
        </div>

        {/* Credit Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
          {planArray.map((plan) => {
            const isPopular = plan.id === 'pro';
            return (
              <div
                key={plan.id}
                className={`rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border p-4 sm:p-5 flex flex-col justify-between relative shadow-xl transition-all ${
                  isPopular 
                    ? 'border-[#7c3aed]/50 shadow-[0_0_25px_rgba(124,58,237,0.15)] ring-1 ring-[#7c3aed]/30' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#7c3aed] text-white shadow-md shadow-purple-900/30">
                    Popular
                  </div>
                )}

                <div>
                  {/* Plan Icon */}
                  <div className="w-7 h-7 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-center mb-3 text-[#7c3aed]">
                    {plan.id === 'starter' ? <Zap className="w-3.5 h-3.5" /> :
                     plan.id === 'pro' ? <Star className="w-3.5 h-3.5" /> :
                     <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-white mb-0.5">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-3 leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Credits Box */}
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-white/5 text-center mb-3.5">
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {plan.credits}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      Credits
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      ₹{(plan.price / 100).toFixed(0)}
                    </span>
                    <span className="text-[11px] text-gray-400 font-normal ml-1">
                      one-time
                    </span>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-2 mb-4 pt-3 border-t border-white/5">
                    {[
                      { icon: Zap, text: 'Instant credit delivery' },
                      { icon: Clock, text: 'No expiration' },
                      { icon: Shield, text: 'All premium features' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-300">
                        <Check className="w-3 h-3 text-[#7c3aed] shrink-0" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading || purchasingPlan === plan.id}
                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isPopular
                        ? 'btn-primary text-white bg-[#7c3aed] hover:bg-[#6d28d9] border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)]'
                        : 'text-white bg-[#141414] hover:bg-white/10 border border-white/10 hover:border-white/20 cursor-pointer'
                    }`}
                  >
                    {purchasingPlan === plan.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      'Purchase Credits'
                    )}
                  </button>

                  {import.meta.env.DEV && (
                    <button
                      onClick={() => handleDemoPurchase(plan.id)}
                      disabled={loading || purchasingPlan === plan.id}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg text-[10px] font-medium bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Demo Purchase (Dev Only)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
              <Gift className="w-3.5 h-3.5 text-[#7c3aed]" />
            </div>
            <h2 className="text-[13px] font-semibold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div key={idx} className="p-3 rounded-xl bg-[#141414] border border-white/5">
                <h3 className="text-[12px] font-semibold text-white mb-1">
                  {faq.question}
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;