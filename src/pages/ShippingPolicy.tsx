import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Zap, Cloud, Globe, Wifi, Server, Shield, Sparkles, CheckCircle2, ArrowRight, Mail, HelpCircle, Clock } from 'lucide-react';

const ShippingPolicy = () => {
  const { darkMode } = useTheme();

  const deliveryFeatures = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "All services are delivered instantly upon payment confirmation",
      gradient: "from-amber-600 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10"
    },
    {
      icon: Cloud,
      title: "Cloud-Based Services",
      description: "No physical shipping required - everything is digital and cloud-based",
      gradient: "from-blue-600 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Globe,
      title: "Global Availability",
      description: "Access your services from anywhere in the world, 24/7",
      gradient: "from-emerald-600 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
      icon: Wifi,
      title: "Real-time Access",
      description: "Credits and features are activated immediately after successful payment",
      gradient: "from-purple-600 to-fuchsia-500",
      bgGradient: "from-purple-500/10 to-fuchsia-500/10"
    }
  ];

  const serviceDelivery = [
    {
      service: "Credit Purchase",
      delivery: "Instant",
      description: "Credits are added to your account immediately after payment verification",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      service: "AI Analysis",
      delivery: "30-60 seconds",
      description: "Startup idea validation and analysis results delivered in real-time",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      service: "Pitch Deck Generation",
      delivery: "1-2 minutes",
      description: "Professional pitch decks generated and available for download",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      service: "Market Research",
      delivery: "2-3 minutes",
      description: "Comprehensive market analysis with TAM/SAM/SOM data",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      service: "Investor Matching",
      delivery: "1-2 minutes",
      description: "AI-powered investor recommendations based on your criteria",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        

        {/* Mesh Gradient Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-orange-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-orange-200/10 to-transparent'}`} />
        
        {/* Animated Grid */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(249,115,22,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        {/* Floating Elements */}
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
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
              <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl ${darkMode ? 'shadow-orange-500/50' : 'shadow-orange-500/30'}`}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className={`text-lg md:text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Service{" "}
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Delivery Policy
                  </span>
                </h1>
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium flex items-center justify-center gap-2`}>
              <Sparkles className="w-4 h-4 text-orange-400" />
              Instant digital service delivery and access
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Digital Services Notice */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 mb-5 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl text-center`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-50"></div>
          <div className="relative">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center mx-auto mb-2 shadow-2xl ${darkMode ? 'shadow-blue-500/50' : 'shadow-blue-500/30'}`}>
              <Server className="w-4 h-4 text-white" />
            </div>
            <h2 className={`text-md sm:text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              100% Digital Services
            </h2>
            <p className={`text-xs leading-relaxed max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              PitchMint provides exclusively digital services. There are no physical products to ship. 
              All features, credits, and AI-generated content are delivered instantly through our platform.
            </p>
          </div>
        </motion.div>

        {/* Delivery Features */}
        <div className="mb-5">
          <h2 className={`text-md md:text-md font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Delivery{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`group relative overflow-hidden rounded-3xl p-3 ${
                  darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
                } backdrop-blur-xl hover:scale-[1.02] transition-all duration-500`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                <div className="relative">
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`text-xs sm:text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Service Delivery Times */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 mb-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg`}>
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Service Delivery Times
              </h2>
            </div>
            
            <div className="space-y-3">
              {serviceDelivery.map((service, index) => (
                <motion.div
                  key={service.service}
                  className={`p-2 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100 border border-gray-200'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`text-xs sm:text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.service}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {service.description}
                      </p>
                    </div>
                    <div className={`px-4 py-1 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-bold text-xs shadow-lg flex-shrink-0 text-center`}>
                      {service.delivery}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technical Requirements */}
        <motion.div 
          className={`relative overflow-hidden rounded-3xl p-3 mb-8 ${
            darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'
          } backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg`}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-sm sm:text-md font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Technical Requirements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Optimal Experience */}
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h3 className={`text-xs sm:text-sm font-bold mb-4 text-blue-500 flex items-center gap-2`}>
                  <CheckCircle2 className="w-4 h-4" />
                  For Optimal Experience
                </h3>
                <ul className="space-y-2">
                  {[
                    "Stable internet connection (minimum 1 Mbps)",
                    "Modern web browser (Chrome, Firefox, Safari, Edge)",
                    "JavaScript enabled",
                    "Cookies enabled for authentication"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 shadow-lg">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Availability */}
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                <h3 className={`text-xs sm:text-sm font-bold mb-4 text-emerald-500 flex items-center gap-2`}>
                  <CheckCircle2 className="w-4 h-4" />
                  Service Availability
                </h3>
                <ul className="space-y-2">
                  {[
                    "99.9% uptime guarantee",
                    "24/7 service availability",
                    "Automatic failover and redundancy",
                    "Regular maintenance windows (announced in advance)"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 opacity-50"></div>
          
          <div className="relative">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center mx-auto mb-2 shadow-2xl ${darkMode ? 'shadow-orange-500/50' : 'shadow-orange-500/30'}`}>
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-sm sm:text-md font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Service Issues?
            </h2>
            <p className={`text-xs mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              If you experience any issues with service delivery, our support team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:antik8795@gmail.com"
                className="inline-flex items-center justify-center px-8 py-1 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Mail className="w-4 h-4 mr-2" />
                Report Issue
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
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPolicy;