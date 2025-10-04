import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Zap, Cloud, Globe, Wifi, Server, Shield } from 'lucide-react';

const ShippingPolicy = () => {
  const { darkMode } = useTheme();

  const deliveryFeatures = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "All services are delivered instantly upon payment confirmation",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Cloud,
      title: "Cloud-Based Services",
      description: "No physical shipping required - everything is digital and cloud-based",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Availability",
      description: "Access your services from anywhere in the world, 24/7",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Wifi,
      title: "Real-time Access",
      description: "Credits and features are activated immediately after successful payment",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const serviceDelivery = [
    {
      service: "Credit Purchase",
      delivery: "Instant",
      description: "Credits are added to your account immediately after payment verification"
    },
    {
      service: "AI Analysis",
      delivery: "30-60 seconds",
      description: "Startup idea validation and analysis results delivered in real-time"
    },
    {
      service: "Pitch Deck Generation",
      delivery: "1-2 minutes",
      description: "Professional pitch decks generated and available for download"
    },
    {
      service: "Market Research",
      delivery: "2-3 minutes",
      description: "Comprehensive market analysis with TAM/SAM/SOM data"
    },
    {
      service: "Investor Matching",
      delivery: "1-2 minutes",
      description: "AI-powered investor recommendations based on your criteria"
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
            <div className="icon-container icon-orange mx-auto mb-3">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Service
              <span className="ml-2 text-gradient-orange">
                Delivery Policy
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Instant digital service delivery and access
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Digital Services Notice */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 mb-12 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="icon-container-md icon-blue mx-auto mb-3">
              <Server className="h-6 w-6 text-white" />
            </div>
            <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              100% Digital Services
            </h2>
            <p className={`text-md leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              PitchMint provides exclusively digital services. There are no physical products to ship. 
              All features, credits, and AI-generated content are delivered instantly through our platform.
            </p>
          </motion.div>

          {/* Delivery Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {deliveryFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} px-4 py-3`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <div className={`icon-container bg-gradient-to-br ${feature.color} mb-2`}>
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <h3 className={`text-md font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Service Delivery Times */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-5 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className={`text-lg font-bold mb-3 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Service Delivery Times
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-4 px-6 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Service
                    </th>
                    <th className={`text-left py-4 px-6 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Delivery Time
                    </th>
                    <th className={`text-left py-4 px-6 font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceDelivery.map((service, index) => (
                    <tr key={service.service} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.service}
                      </td>
                      <td className={`py-4 px-6`}>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {service.delivery}
                        </span>
                      </td>
                      <td className={`py-4 px-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {service.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Technical Requirements */}
          <motion.div 
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-5 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Technical Requirements
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-md font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  For Optimal Experience
                </h3>
                <ul className="space-y-2">
                  {[
                    "Stable internet connection (minimum 1 Mbps)",
                    "Modern web browser (Chrome, Firefox, Safari, Edge)",
                    "JavaScript enabled",
                    "Cookies enabled for authentication"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={`text-md font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Service Availability
                </h3>
                <ul className="space-y-2">
                  {[
                    "99.9% uptime guarantee",
                    "24/7 service availability",
                    "Automatic failover and redundancy",
                    "Regular maintenance windows (announced in advance)"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></div>
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
              Service Issues?
            </h2>
            <p className={`text-md mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              If you experience any issues with service delivery, our support team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:antik8795@gmail.com"
                className="btn-primary btn-primary-orange"
              >
                Report Issue
              </a>
              <a
                href="/help"
                className={`btn-secondary ${darkMode ? 'btn-secondary-dark' : 'btn-secondary-light'}`}
              >
                Help Center
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;