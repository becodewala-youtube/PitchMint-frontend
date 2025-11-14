import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, Sparkles, ArrowRight, Mail, MessageSquare } from 'lucide-react';

const RefundPolicy = () => {
  const { darkMode } = useTheme();

  const refundConditions = [
    {
      icon: CheckCircle,
      title: "Eligible for Refund",
      gradient: "from-emerald-600 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      items: [
        "Request made within 7 days of purchase",
        "Credits purchased but not yet used",
        "Technical issues preventing service access",
        "Duplicate charges or billing errors",
        "Service not delivered as promised"
      ],
      color: "emerald"
    },
    {
      icon: XCircle,
      title: "Not Eligible for Refund",
      gradient: "from-red-600 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      items: [
        "Credits already used for AI services",
        "Request made after 7-day window",
        "Dissatisfaction with AI-generated content",
        "Change of mind after using services",
        "Account suspension due to policy violations"
      ],
      color: "red"
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: "Submit Request",
      description: "Contact our support team with your refund request and order details",
      gradient: "from-blue-600 to-cyan-500"
    },
    {
      step: 2,
      title: "Review Process",
      description: "We review your request within 2-3 business days",
      gradient: "from-violet-600 to-purple-500"
    },
    {
      step: 3,
      title: "Approval Decision",
      description: "You'll receive an email with our decision and next steps",
      gradient: "from-amber-600 to-orange-500"
    },
    {
      step: 4,
      title: "Refund Processing",
      description: "Approved refunds are processed within 5-7 business days",
      gradient: "from-emerald-600 to-teal-500"
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
       

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-emerald-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-emerald-500/50' : 'shadow-emerald-500/30'}`}>
                <RotateCcw className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-l
                  md md:text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Refund &{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Cancellation Policy
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Our commitment to fair and transparent refunds
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Policy Overview */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 mb-5 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-50"></div>
          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className={`text-sm font-bold mt-2  ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  7-Day Refund Window
                </h2>
              </div>
            </div>
            <p className={`text-xs text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We offer a 7-day refund policy for credit purchases. If you're not satisfied with your purchase 
              and haven't used the credits, you can request a full refund within 7 days of purchase. This policy 
              ensures you can try our services risk-free while maintaining fairness for our AI processing costs.
            </p>
          </div>
        </motion.div>

        {/* Refund Conditions */}
        <div className="mb-8">
          <h2 className={`text-md md:text-lg font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Refund{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Eligibility
            </span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {refundConditions.map((condition, index) => (
              <motion.div
                key={condition.title}
                className={`group relative overflow-hidden rounded-3xl p-3 ${
                  darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
                } backdrop-blur-xl hover:scale-[1.02] transition-all duration-500`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${condition.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${condition.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                <div className="relative">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${condition.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <condition.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {condition.title}
                    </h3>
                  </div>

                  {/* Items List */}
                  <ul className="space-y-2">
                    {condition.items.map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 + i * 0.05 }}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${condition.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg`}>
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Refund Process */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 mb-5 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          
          <div className="relative">
            <h2 className={`text-sm sm:text-md font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Refund Process Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refundProcess.map((step, index) => (
                <motion.div 
                  key={step.step} 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-2 shadow-2xl hover:scale-110 transition-all duration-300`}>
                    <span className="text-white font-black text-md">{step.step}</span>
                  </div>
                  <h3 className={`text-xs ms:text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl text-center`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-50"></div>
          
          <div className="relative">
            <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center mx-auto mb-2 shadow-2xl ${darkMode ? 'shadow-emerald-500/50' : 'shadow-emerald-500/30'}`}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h2 className={`text-sm sm:text-md font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Need a Refund?
            </h2>
            <p className={`text-xs mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Contact our support team to initiate a refund request. We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:antik8795@gmail.com"
                className="inline-flex items-center justify-center px-8 py-1 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request Refund
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="/help-center"
                className={`inline-flex items-center justify-center px-8 py-1 sm:py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
                  darkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;