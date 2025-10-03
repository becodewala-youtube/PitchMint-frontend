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
  Zap
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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Entrepreneur-First',
      description: 'Built by entrepreneurs, for entrepreneurs. We understand your journey because we\'ve lived it.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to provide insights that were once available only to large corporations.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Supporting startups worldwide, from solo founders to growing teams, across every industry.',
      color: 'from-green-500 to-emerald-500'
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
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="icon-container icon-purple mx-auto mb-2">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-cyan-500 transition-colors duration-300`}>
                  Pitch<span className="text-cyan-500">Mint</span>
                </span>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Empowering entrepreneurs to turn ideas into reality with AI-powered validation
            </p>
          </motion.div>

          <motion.div
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} px-4 py-3 mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Story
              </h2>
              <p className={`text-md leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                PitchMint was born from a simple observation: countless brilliant startup ideas fail not because they lack potential, but because founders lack access to professional validation and investor-ready materials.
              </p>
              <p className={`text-md leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                As entrepreneurs ourselves, we experienced the frustration of spending weeks creating pitch decks, conducting market research, and preparing for investor meetings. We knew there had to be a better way.
              </p>
              <p className={`text-md leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Today, PitchMint combines advanced AI technology with deep business expertise to give every entrepreneur access to the tools and insights that were once available only to well-funded startups with advisory teams.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} py-2 text-center`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <div className={`text-xl md:text-xl font-black mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className={`text-xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-4`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start">
                    <div className={`icon-container bg-gradient-to-br ${value.color} mr-4 flex-shrink-0`}>
                      <value.icon className="h-4 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-md font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {value.title}
                      </h3>
                      <p className={`leading-relaxed text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          

         
          <motion.div
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-4 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.9 }}
          >
            <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Join Our Mission
            </h2>
            <p className={`text-sm mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Whether you're a first-time founder or a serial entrepreneur, we're here to support your journey from idea to launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = '/signup'}
                className="btn-primary btn-primary-cyan px-8 py-1 text-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Validating Free
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/contact'}
                className={`px-8 py-1 text-md font-semibold rounded-2xl border-2 transition-all duration-300 ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10'
                    : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
