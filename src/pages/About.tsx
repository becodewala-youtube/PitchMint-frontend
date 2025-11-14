import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Target,
  Heart,
  Users,
  Lightbulb,
  Rocket,
  Award,
  TrendingUp,
  Globe,
  Zap,
  Sparkles
} from 'lucide-react';

const About = () => {
  const { darkMode } = useTheme();

  const stats = [
    { value: '100+', label: 'Ideas Validated' },
    { value: '5+', label: 'Entrepreneurs Helped' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '5+', label: 'Countries Served' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'Empowering entrepreneurs to validate their ideas and bring innovation to market faster.',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Heart,
      title: 'Entrepreneur-First',
      description: 'Built by entrepreneurs, for entrepreneurs. We understand your journey because we\'ve lived it.',
      color: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-500/10 to-rose-500/10'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to provide insights that were once available only to large corporations.',
      color: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Supporting startups worldwide, from solo founders to growing teams, across every industry.',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-[#0a0118]" : "bg-gray-50"}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
       

        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-purple-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-center">
              <div
                className={`hidden md:flex md:w-8 md:h-8 w-6 h-6 rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 items-center justify-center shadow-2xl ${
                  darkMode ? "shadow-pink-500/50" : "shadow-pink-500/30"
                }`}
              >
                <Heart className="md:w-4 md:h-4 w-3 h-3 text-white" />
              </div>

              <div>
                <h1 className={`text-lg md:text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  About{" "}
                  <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                    PitchMint
                  </span>
                </h1>
                <p className={`text-xs  ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                  Empowering entrepreneurs to turn ideas into reality with AI-powered validation
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Story Card */}
        <motion.div
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-2 md:p-3 mb-5 ${
            darkMode ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
          } backdrop-blur-xl shadow-2xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={`absolute -inset-1 bg-gradient-to-br from-pink-600/20 via-rose-600/10 to-red-600/20 opacity-50 blur-xl`} />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className={`text-md md:text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Story
            </h2>
            <p className={`text-xs md:text-sm leading-relaxed mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              PitchMint was born from a simple observation: countless brilliant startup ideas fail not because they lack potential, but because founders lack access to professional validation and investor-ready materials.
            </p>
            <p className={`text-xs md:text-sm leading-relaxed mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              As entrepreneurs ourselves, we experienced the frustration of spending weeks creating pitch decks, conducting market research, and preparing for investor meetings. We knew there had to be a better way.
            </p>
            <p className={`text-xs md:text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Today, PitchMint combines advanced AI technology with deep business expertise to give every entrepreneur access to the tools and insights that were once available only to well-funded startups with advisory teams.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-1 md:p-2 text-center ${
                darkMode
                  ? "bg-gray-900/50 border border-gray-800/50"
                  : "bg-white border border-gray-200"
              } backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className={`absolute -inset-1 bg-gradient-to-br from-pink-500 to-rose-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

              <div className="relative">
                <div className={`text-lg md:text-xl font-black mb-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-xs md:text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Our Values */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="mb-4">
            <h2 className={`text-lg md:text-lg font-black text-center mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Our Values
            </h2>
            <p className={`text-xs  text-center ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium`}>
              What drives us every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-3 ${
                  darkMode ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
                } backdrop-blur-xl hover:scale-105 transition-all duration-500 cursor-pointer`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                <div className="relative flex items-start gap-4">
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0`}>
                    <value.icon className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm md:text-md font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {value.title}
                    </h3>
                    <p className={`text-xs  leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Our Mission CTA */}
        <motion.div
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-2 md:p-3 text-center ${
            darkMode ? "bg-gray-900/50 border border-gray-800/50" : "bg-white border border-gray-200"
          } backdrop-blur-xl shadow-2xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className={`absolute -inset-1 bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-indigo-600/20 opacity-50 blur-xl`} />
          
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-xl ${darkMode ? 'shadow-cyan-500/50' : 'shadow-cyan-500/30'}`}>
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <h2 className={`text-sm md:text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Join Our Mission
              </h2>
            </div>

            <p className={`text-xs md:text-sm mb-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Whether you're a first-time founder or a serial entrepreneur, we're here to support your journey from idea to launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = '/signup'}
                className="px-6 md:px-8 py-1 sm:py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white text-xs  font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4" />
                Start Validating Free
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/contact'}
                className={`px-6 md:px-8 py-1 sm:py-2 text-xs  font-bold rounded-xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10'
                    : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;