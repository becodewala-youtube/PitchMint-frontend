import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  CreditCard, 
  Brain, 
  FileText, 
  Users, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const HelpCenter = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      categoryColor: "from-emerald-500 to-teal-500",
      question: "How do I submit my first startup idea?",
      answer: "Navigate to the 'Submit Idea' page, describe your startup concept in detail, and click 'Analyze Idea'. Our AI will provide comprehensive validation including market demand, competition analysis, and monetization potential."
    },
    {
      category: "Credits & Billing",
      categoryColor: "from-amber-500 to-orange-500",
      question: "How do credits work?",
      answer: "Credits are used to access AI-powered features. Free users get 3 credits monthly. Each feature (idea validation, pitch deck generation, etc.) costs 1-2 credits. Purchased credits never expire."
    },
    {
      category: "Credits & Billing",
      categoryColor: "from-amber-500 to-orange-500",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking through our secure Razorpay payment gateway. All transactions are processed in Indian Rupees (INR)."
    },
    {
      category: "AI Features",
      categoryColor: "from-violet-500 to-purple-500",
      question: "How accurate is the AI analysis?",
      answer: "Our AI uses advanced language models trained on extensive business data. While highly sophisticated, results should be used as guidance alongside your own research and professional advice."
    },
    {
      category: "AI Features",
      categoryColor: "from-violet-500 to-purple-500",
      question: "Can I regenerate AI content if I'm not satisfied?",
      answer: "Yes! You can regenerate any AI content (pitch decks, analysis, etc.) by clicking the regenerate button. Each regeneration costs 1 credit."
    },
    {
      category: "Getting Started",
      categoryColor: "from-emerald-500 to-teal-500",
      question: "What makes a good startup idea description?",
      answer: "Be specific about the problem you're solving, your target market, and how your solution is unique. Include potential revenue streams and mention any existing alternatives."
    },
    {
      category: "Credits & Billing",
      categoryColor: "from-amber-500 to-orange-500",
      question: "Can I get a refund for unused credits?",
      answer: "Yes, we offer refunds for unused credits within 7 days of purchase. Contact our support team with your refund request."
    }
  ];

  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div
          className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-purple-600/30"
              : "bg-gradient-to-br from-blue-300/40 via-indigo-300/30 to-purple-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-cyan-600/30 via-teal-600/20 to-emerald-600/30"
              : "bg-gradient-to-br from-cyan-300/40 via-teal-300/30 to-emerald-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-fuchsia-600/20 via-pink-600/10 to-rose-600/20"
              : "bg-gradient-to-br from-fuchsia-300/30 via-pink-300/20 to-rose-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-indigo-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-indigo-500/50' : 'shadow-indigo-500/30'}`}>
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Help{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Center
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Find answers and get support for your startup journey
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className={`relative overflow-hidden rounded-2xl p-1 mb-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 text-sm rounded-xl border-2 transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800/50 text-white border-gray-700/50 placeholder-gray-500 focus:border-indigo-500 focus:bg-gray-800'
                  : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:border-indigo-500 focus:bg-white'
              } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
            />
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg`}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-2xl ${
                  darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
                } backdrop-blur-xl transition-all duration-300 ${openFaq === index ? 'shadow-xl' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-6 flex items-start justify-between transition-all duration-300 ${
                    openFaq === index ? 'pb-4' : ''
                  }`}
                >
                  <div className="flex-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold mb-3 bg-gradient-to-r ${faq.categoryColor} text-white shadow-lg`}>
                      {faq.category === "Getting Started" && <Zap className="w-3 h-3 mr-1" />}
                      {faq.category === "Credits & Billing" && <CreditCard className="w-3 h-3 mr-1" />}
                      {faq.category === "AI Features" && <Brain className="w-3 h-3 mr-1" />}
                      {faq.category}
                    </span>
                    <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ml-4 flex-shrink-0 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800 text-gray-400' 
                      : 'bg-gray-100 text-gray-600'
                  } ${openFaq === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No results found
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try a different search term or contact support
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg`}>
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Still Need Help?
              </h2>
            </div>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Our support team is here to help you succeed with your startup journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Support */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-base font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Email Support
                </h3>
                <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get detailed help via email
                </p>
                <a
                  href="mailto:support@pitchmint.com"
                  className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Send Email
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
              
              {/* Response Time */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-base font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Response Time
                </h3>
                <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We typically respond within
                </p>
                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  24 hours
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenter;