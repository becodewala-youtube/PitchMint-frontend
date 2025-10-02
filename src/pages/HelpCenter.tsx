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
  Clock
} from 'lucide-react';

const HelpCenter = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: Brain,
      title: "Getting Started",
      description: "Learn how to validate your first startup idea",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: CreditCard,
      title: "Credits & Billing",
      description: "Understanding credits, payments, and refunds",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "AI Features",
      description: "Pitch decks, market research, and competitor analysis",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working with team members on pitch decks",
      color: "from-orange-500 to-red-500"
    }
  ];

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I submit my first startup idea?",
      answer: "Navigate to the 'Submit Idea' page, describe your startup concept in detail, and click 'Analyze Idea'. Our AI will provide comprehensive validation including market demand, competition analysis, and monetization potential."
    },
    {
      category: "Credits & Billing",
      question: "How do credits work?",
      answer: "Credits are used to access AI-powered features. Free users get 3 credits monthly. Each feature (idea validation, pitch deck generation, etc.) costs 1-2 credits. Purchased credits never expire."
    },
    {
      category: "Credits & Billing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking through our secure Razorpay payment gateway. All transactions are processed in Indian Rupees (INR)."
    },
    {
      category: "AI Features",
      question: "How accurate is the AI analysis?",
      answer: "Our AI uses advanced language models trained on extensive business data. While highly sophisticated, results should be used as guidance alongside your own research and professional advice."
    },
    {
      category: "AI Features",
      question: "Can I regenerate AI content if I'm not satisfied?",
      answer: "Yes! You can regenerate any AI content (pitch decks, analysis, etc.) by clicking the regenerate button. Each regeneration costs 1 credit."
    },
    {
      category: "Collaboration",
      question: "How do I invite team members to collaborate?",
      answer: "In the collaborative pitch deck view, click 'Invite Collaborators' to get a shareable link. Team members can join using this link to edit slides and add comments in real-time."
    },
    {
      category: "Getting Started",
      question: "What makes a good startup idea description?",
      answer: "Be specific about the problem you're solving, your target market, and how your solution is unique. Include potential revenue streams and mention any existing alternatives."
    },
    {
      category: "Credits & Billing",
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
            <div className="icon-container icon-blue mx-auto mb-8">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Help
              <span className="ml-2 text-gradient-blue">
                Center
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Find answers and get support for your startup journey
            </p>
          </motion.div>

          {/* Search */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:border-blue-500'
                } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>
          </motion.div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-6 text-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`icon-container bg-gradient-to-br ${category.color} mx-auto mb-4`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {category.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border rounded-2xl ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full text-left p-6 flex items-center justify-between hover:bg-gray-50/50 ${
                      darkMode ? 'hover:bg-gray-700/50' : ''
                    } transition-colors duration-300 rounded-2xl`}
                  >
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {faq.category}
                      </span>
                      <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {faq.question}
                      </h3>
                    </div>
                    {openFaq === index ? (
                      <ChevronUp className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Still Need Help?
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Our support team is here to help you succeed with your startup journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="icon-container icon-blue mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Email Support
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get detailed help via email
                </p>
                <a
                  href="mailto:support@pitchmint.com"
                  className="btn-primary btn-primary-blue text-sm"
                >
                  Send Email
                </a>
              </div>
              
              <div className="text-center">
                <div className="icon-container icon-green mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Live Chat
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Chat with our support team
                </p>
                <button className="btn-primary btn-primary-green text-sm">
                  Start Chat
                </button>
              </div>
              
              <div className="text-center">
                <div className="icon-container icon-orange mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Response Time
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We typically respond within
                </p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  24 hours
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;