import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale, Sparkles, CheckCircle2, Mail } from 'lucide-react';

const TermsOfService = () => {
  const { darkMode } = useTheme();

  const sections = [
    {
      icon: Users,
      title: "Acceptance of Terms",
      gradient: "from-blue-600 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      content: [
        "By accessing and using PitchMint, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our platform",
        "We may update these terms periodically, and continued use constitutes acceptance",
        "You must be at least 18 years old to use PitchMint services"
      ]
    },
    {
      icon: FileText,
      title: "Service Description",
      gradient: "from-violet-600 to-purple-500",
      bgGradient: "from-violet-500/10 to-purple-500/10",
      content: [
        "PitchMint provides AI-powered startup idea validation and business planning tools",
        "Services include idea analysis, pitch deck generation, market research, and investor matching",
        "All AI-generated content is for informational purposes and should not replace professional advice",
        "We do not guarantee the accuracy or completeness of AI-generated analysis",
        "Service availability may vary and is subject to maintenance and updates"
      ]
    },
    {
      icon: CreditCard,
      title: "Payment and Credits",
      gradient: "from-emerald-600 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      content: [
        "Credits are required to access premium AI-powered features",
        "Free users receive 3 credits monthly; additional credits can be purchased",
        "All payments are processed securely through Razorpay",
        "Purchased credits do not expire but monthly free credits reset each month",
        "Prices are subject to change with 30 days notice to existing users",
        "Refunds are available within 7 days if credits haven't been used"
      ]
    },
    {
      icon: Shield,
      title: "User Responsibilities",
      gradient: "from-amber-600 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      content: [
        "Provide accurate information when creating your account",
        "Keep your login credentials secure and confidential",
        "Use the platform only for legitimate business purposes",
        "Do not share copyrighted or proprietary information without permission",
        "Respect intellectual property rights of others",
        "Report any security vulnerabilities or misuse to our team"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Uses",
      gradient: "from-red-600 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      content: [
        "Attempting to reverse engineer or copy our AI algorithms",
        "Using the platform for illegal activities or fraudulent purposes",
        "Sharing account credentials with unauthorized users",
        "Submitting malicious code, viruses, or harmful content",
        "Violating any applicable laws or regulations",
        "Interfering with the platform's security or functionality"
      ]
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      gradient: "from-indigo-600 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      content: [
        "PitchMint is provided 'as is' without warranties of any kind",
        "We are not liable for business decisions made based on our AI analysis",
        "Our liability is limited to the amount paid for services in the past 12 months",
        "We are not responsible for third-party services or external links",
        "Force majeure events are excluded from our liability",
        "Some jurisdictions may not allow liability limitations"
      ]
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
        

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-violet-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-violet-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-violet-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
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
              <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-violet-500/50' : 'shadow-violet-500/30'}`}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-lg md:text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Terms of{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Service
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-violet-400" />
              Legal terms and conditions for using PitchMint
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 mb-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className={`text-sm font-bold mb-2 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                  Welcome to PitchMint
                </h2>
              </div>
            </div>
            <p className={`text-xs text-justify leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome to PitchMint! These Terms of Service ("Terms") govern your use of our AI-powered startup 
              validation platform. Please read these terms carefully before using our services. By creating an 
              account or using PitchMint, you agree to be bound by these terms.
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
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <section.icon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h2>
                </div>

                {/* Content List */}
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 + i * 0.05 }}
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg`}>
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
          className={`relative overflow-hidden rounded-3xl p-3 mt-5 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl text-center`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 opacity-50"></div>
          <div className="relative">
            <h3 className={`text-md font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Questions About Terms?
            </h3>
            <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <a
              href="mailto:legal@pitchmint.com"
              className="inline-flex items-center px-6 py-1 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Legal Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;