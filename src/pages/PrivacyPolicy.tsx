import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const { darkMode } = useTheme();

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
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
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Privacy
              <span className="ml-2 text-gradient-blue">
                Policy
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              How we protect and handle your data
            </p>
            <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              At PitchMint, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered startup 
              validation platform. By using PitchMint, you agree to the practices described in this policy.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className="icon-container icon-blue mr-4">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-4">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-4 flex-shrink-0"></div>
                      <span className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 mt-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Questions About Privacy?
            </h2>
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              If you have any questions about this Privacy Policy or our data practices, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@pitchmint.com"
                className="btn-primary btn-primary-blue"
              >
                Email Privacy Team
              </a>
              <a
                href="/contact"
                className={`btn-secondary ${darkMode ? 'btn-secondary-dark' : 'btn-secondary-light'}`}
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;