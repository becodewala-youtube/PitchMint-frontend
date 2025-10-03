import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const RefundPolicy = () => {
  const { darkMode } = useTheme();

  const refundConditions = [
    {
      icon: CheckCircle,
      title: "Eligible for Refund",
      items: [
        "Request made within 7 days of purchase",
        "Credits purchased but not yet used",
        "Technical issues preventing service access",
        "Duplicate charges or billing errors",
        "Service not delivered as promised"
      ],
      color: "text-green-500"
    },
    {
      icon: XCircle,
      title: "Not Eligible for Refund",
      items: [
        "Credits already used for AI services",
        "Request made after 7-day window",
        "Dissatisfaction with AI-generated content",
        "Change of mind after using services",
        "Account suspension due to policy violations"
      ],
      color: "text-red-500"
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: "Submit Request",
      description: "Contact our support team with your refund request and order details"
    },
    {
      step: 2,
      title: "Review Process",
      description: "We review your request within 2-3 business days"
    },
    {
      step: 3,
      title: "Approval Decision",
      description: "You'll receive an email with our decision and next steps"
    },
    {
      step: 4,
      title: "Refund Processing",
      description: "Approved refunds are processed within 5-7 business days"
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
            <div className="icon-container icon-green mx-auto mb-3">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Refund &
              <span className="ml-2 text-gradient-green">
                Cancellation Policy
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our commitment to fair and transparent refunds
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Policy Overview */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                7-Day Refund Window
              </h2>
            </div>
            <p className={`text-md leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              We offer a 7-day refund policy for credit purchases. If you're not satisfied with your purchase 
              and haven't used the credits, you can request a full refund within 7 days of purchase. This policy 
              ensures you can try our services risk-free while maintaining fairness for our AI processing costs.
            </p>
          </motion.div>

          {/* Refund Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {refundConditions.map((condition, index) => (
              <motion.div
                key={condition.title}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-5`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <condition.icon className={`h-6 w-6 ${condition.color} mr-3`} />
                  <h3 className={`text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {condition.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {condition.items.map((item, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <div className={`w-2 h-2 rounded-full  ${condition.color.replace('text-', 'bg-')} mt-2 mr-3 flex-shrink-0`}></div>
                      <span className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Refund Process */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className={`text-lg font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Refund Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refundProcess.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="icon-container icon-green mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className={`text-md font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

         

          {/* Contact Section */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Need a Refund?
            </h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Contact our support team to initiate a refund request. We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row  gap-4 justify-center">
              <a
                href="mailto:antik8795@gmail.com"
                className="btn-primary btn-primary-green"
              >
                Request Refund
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

export default RefundPolicy;