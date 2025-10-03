import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

const TermsOfService = () => {
  const { darkMode } = useTheme();

  const sections = [
    {
      icon: Users,
      title: "Acceptance of Terms",
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
            <div className="icon-container icon-purple mx-auto mb-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Terms of
              <span className="ml-2 text-gradient-primary">
                Service
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Legal terms and conditions for using PitchMint
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className={`text-md leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome to PitchMint! These Terms of Service ("Terms") govern your use of our AI-powered startup 
              validation platform. Please read these terms carefully before using our services. By creating an 
              account or using PitchMint, you agree to be bound by these terms.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-5`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="icon-container icon-purple mr-4">
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 mr-4 flex-shrink-0"></div>
                      <span className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;