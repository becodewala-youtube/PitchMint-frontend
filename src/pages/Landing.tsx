import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Lightbulb, Rocket, Award, Brain, FileText, Users, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect, useState } from 'react';


interface StarFieldProps {
  darkMode: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
  animationDuration: number;
}

interface Comet {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  animationDelay: number;
  animationDuration: number;
}

const StarField = ({ darkMode }: StarFieldProps) => {
  const [stars, setStars] = useState<Star[]>([]); 
  const [comets, setComets] = useState<Comet[]>([]); 



  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 5,
          animationDuration: Math.random() * 3 + 2,
        });
      }
      setStars(starArray);
    };

    // Generate random comets
    const generateComets = () => {
      const cometArray = [];
      for (let i = 0; i < 3; i++) {
        cometArray.push({
          id: i,
          startX: Math.random() * 100,
          startY: -10,
          endX: Math.random() * 100,
          endY: 110,
          animationDelay: Math.random() * 10,
          animationDuration: Math.random() * 3 + 4,
        });
      }
      setComets(cometArray);
    };

    generateStars();
    generateComets();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={`absolute rounded-full ${
            darkMode ? 'bg-white' : 'bg-gray-800'
          }`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration}s ease-in-out infinite`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}

      {/* Comets */}
      {comets.map((comet) => (
        <div
          key={`comet-${comet.id}`}
          className="absolute"
          style={{
            animation: `comet ${comet.animationDuration}s linear infinite`,
            animationDelay: `${comet.animationDelay}s`,
          }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              darkMode
                ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                : 'bg-gradient-to-r from-yellow-400 to-orange-400'
            }`}
            style={{
              boxShadow: darkMode
                ? '0 0 6px #60a5fa, 0 0 12px #a855f7, 0 0 18px #a855f7'
                : '0 0 6px #fbbf24, 0 0 12px #f97316, 0 0 18px #f97316',
            }}
          />
          <div
            className={`absolute top-0 left-0 w-1 h-12 ${
              darkMode
                ? 'bg-gradient-to-t from-transparent via-blue-400 to-purple-400'
                : 'bg-gradient-to-t from-transparent via-yellow-400 to-orange-400'
            } transform -rotate-45 origin-bottom`}
            style={{
              transform: 'rotate(-45deg) translateX(-50%)',
              filter: 'blur(1px)',
            }}
          />
        </div>
      ))}

      {/* Shooting Stars */}
      <div className="shooting-star-1"></div>
      <div className="shooting-star-2"></div>
      <div className="shooting-star-3"></div>

      <style>{` // <--- 'jsx' prop removed
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes comet {
          0% {
            transform: translateX(${comets[0]?.startX || 0}vw) translateY(-10vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(${comets[0]?.endX || 0}vw) translateY(110vh);
            opacity: 0;
          }
        }

        .shooting-star-1, .shooting-star-2, .shooting-star-3 {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: ${darkMode ? '#ffffff' : '#1f2937'};
          animation: shoot 3s linear infinite;
        }

        .shooting-star-1 {
          top: 20%;
          left: 0;
          animation-delay: 0s;
        }

        .shooting-star-2 {
          top: 40%;
          left: 0;
          animation-delay: 1.5s;
        }

        .shooting-star-3 {
          top: 60%;
          left: 0;
          animation-delay: 3s;
        }

        @keyframes shoot {
          0% {
            transform: translateX(-100px) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-200px);
            opacity: 0;
          }
        }

        .shooting-star-1::after, .shooting-star-2::after, .shooting-star-3::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, ${darkMode ? '#ffffff' : '#1f2937'}, transparent);
          transform: translateX(-100px);
        }
      `}</style>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Validation',
      description: 'Get instant analysis of your startup idea with detailed scores for market demand, competition, and monetization potential.'
    },
    {
      icon: FileText,
      title: 'Professional Pitch Decks',
      description: 'Generate investor-ready pitch decks automatically with all essential sections and compelling content.'
    },
    {
      icon: Users,
      title: 'Competitor Analysis',
      description: 'Deep dive into your competitive landscape with detailed SWOT analysis and market positioning.'
    },
    {
      icon: MessageSquare,
      title: 'Pitch Simulator',
      description: 'Practice your pitch with AI-powered investor Q&A and get real-time feedback to improve.'
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped me validate my startup idea and secure seed funding. The AI-generated insights were incredibly valuable.",
      author: "Sarah Chen",
      role: "Founder, TechStart"
    },
    {
      quote: "The pitch simulator prepared me for real investor meetings. It's like having a personal pitch coach available 24/7.",
      author: "Michael Rodriguez",
      role: "CEO, InnovateCo"
    },
    {
      quote: "Generated a professional pitch deck in minutes that would have taken weeks to create manually. Highly recommended!",
      author: "Emily Zhang",
      role: "Founder, DataFlow"
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'} animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-400 to-blue-400'} animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 ${darkMode ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-purple-400 to-pink-400'} animate-spin-slow`}></div>
        
        {/* Star Field Animation - Only in Dark Mode */}
        {darkMode && <StarField darkMode={darkMode} />}
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 sm:pb-16">
          {/* Product Hunt Badge */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/30' : 'bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200'} backdrop-blur-sm`}>
              <span className="text-sm sm:text-2xl mr-2">🚀</span>
              <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-orange-800'}`}>
                #1 AI-Powered Startup Validator
              </span>
            </div>
          </motion.div>

          <div className="text-center">
            <motion.h1 
              className={`text-4xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">Validate Your</span>
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-500 to-cyan-500 bg-clip-text text-transparent">
                Startup Ideas
              </span>
              <span className="block">with AI Power</span>
            </motion.h1>
            
            <motion.p 
              className={`text-sm md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Get instant validation, generate professional pitch decks, and practice with AI investors. 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
                Turn your ideas into reality.
              </span>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="group relative px-8 py-2 sm:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center">
                  Start Validating Free
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className={`px-8 py-2 sm:py-4 font-semibold rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10' 
                    : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Sign In
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Free Forever</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No Credit Card Required</span>
              </div> */}
              {/* <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Instant Results</span>
              </div> */}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`relative z-10 py-8 sm:py-24 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Launch Successfully
              </span>
            </h2>
            <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Comprehensive AI-powered tools to validate, refine, and pitch your startup ideas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`group relative p-4 sm:p-8 rounded-3xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className={`w-10 h-10 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center mb-2 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className={`text-md sm:text-xl font-bold mb-2 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-purple-500 transition-colors duration-300`}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 py-8 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Trusted by
              <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Successful Founders
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={`group relative p-4 sm:p-8 rounded-3xl ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center mb-2 sm:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className={`text-sm sm:text-lg italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className={`w-8 sm:w-12 h-8 sm:h-12 rounded-full ${darkMode ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center mr-4`}>
                      <span className="text-white font-bold text-sm sm:text-lg">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm sm:text-md font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.author}
                      </p>
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`relative z-10 py-8 sm:py-24 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Build the
              <span className="block bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
                Next Big Thing?
              </span>
            </h2>
            <p className={`text-sm sm:text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of entrepreneurs who've validated their ideas with AI
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="group relative px-8 py-2 sm:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-sm sm:text-lg rounded-3xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center">
                Start Your Journey Today
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;