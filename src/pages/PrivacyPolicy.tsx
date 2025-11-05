import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  const { darkMode } = useTheme();

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      gradient: "from-blue-600 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      content: [
        "Personal Information: Name, email address, profile picture when you create an account",
        "Startup Ideas: The business ideas you submit for validation and analysis",
        "Usage Data: How you interact with our platform, features used, and session information",
        "Payment Information: Billing details processed securely through Razorpay (we don't store card details)",
        "Communication Data: Messages, comments, and collaboration data in pitch decks"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      gradient: "from-emerald-600 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      content: [
        "Provide AI-powered startup validation and analysis services",
        "Generate personalized pitch decks, business model canvases, and market research",
        "Process payments and manage your credit balance",
        "Send important account notifications and service updates",
        "Improve our AI models and platform functionality",
        "Provide customer support and respond to your inquiries"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      gradient: "from-purple-600 to-fuchsia-500",
      bgGradient: "from-purple-500/10 to-fuchsia-500/10",
      content: [
        "All data is encrypted in transit using SSL/TLS protocols",
        "Database encryption at rest for sensitive information",
        "Regular security audits and vulnerability assessments",
        "Secure authentication using JWT tokens with expiration",
        "Payment processing through PCI-compliant Razorpay gateway",
        "Access controls and monitoring for all data operations"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      gradient: "from-amber-600 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      content: [
        "Access: Request a copy of your personal data",
        "Correction: Update or correct inaccurate information",
        "Deletion: Request deletion of your account and associated data",
        "Portability: Export your startup ideas and analysis data",
        "Opt-out: Unsubscribe from marketing communications",
        "Complaint: Contact us about privacy concerns"
      ]
    },
    {
      icon: Globe,
      title: "Data Sharing",
      gradient: "from-indigo-600 to-violet-500",
      bgGradient: "from-indigo-500/10 to-violet-500/10",
      content: [
        "We do not sell your personal information to third parties",
        "AI analysis is processed using Google's Gemini API (subject to Google's privacy policy)",
        "Payment processing through Razorpay (subject to Razorpay's privacy policy)",
        "Anonymous usage analytics to improve our services",
        "Legal compliance when required by law or regulation",
        "Business transfers only with equivalent privacy protections"
      ]
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        <div
          className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-blue-600/30 via-cyan-600/20 to-teal-600/30"
              : "bg-gradient-to-br from-blue-300/40 via-cyan-300/30 to-teal-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-purple-600/30 via-fuchsia-600/20 to-pink-600/30"
              : "bg-gradient-to-br from-purple-300/40 via-fuchsia-300/30 to-pink-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20"
              : "bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-cyan-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-blue-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-blue-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
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
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-blue-500/50' : 'shadow-blue-500/30'}`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Privacy{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Policy
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-blue-400" />
              How we protect and handle your data
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-6 mb-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 opacity-50"></div>
          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-sm font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Our Commitment to Your Privacy
                </h2>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              At PitchMint, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered startup 
              validation platform. By using PitchMint, you agree to the practices described in this policy.
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              className={`group relative overflow-hidden rounded-3xl p-6 ${
                darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
              } backdrop-blur-xl hover:scale-[1.01] transition-all duration-500`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

              <div className="relative">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h2>
                </div>

                {/* Content List */}
                <ul className="space-y-4">
                  {section.content.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + i * 0.05 }}
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Footer */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-6 mt-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl text-center`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          <div className="relative">
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Questions About Privacy?
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              If you have any questions or concerns about our privacy practices, please contact us.
            </p>
            <a
              href="mailto:privacy@pitchmint.com"
              className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Shield className="w-4 h-4 mr-2" />
              Contact Privacy Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;