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
    { value: '10,000+', label: 'Ideas Validated' },
    { value: '5,000+', label: 'Entrepreneurs Helped' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '50+', label: 'Countries Served' }
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

  const journey = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'PitchMint was founded with a simple mission: democratize access to professional startup validation and pitch deck creation.',
      icon: Lightbulb
    },
    {
      year: '2024',
      title: 'Rapid Growth',
      description: 'Helped thousands of entrepreneurs validate their ideas and secure funding through AI-powered insights and professional pitch decks.',
      icon: TrendingUp
    },
    {
      year: 'Today',
      title: 'Leading Platform',
      description: 'Recognized as the go-to platform for startup validation, with advanced features like investor matching, market research, and collaborative tools.',
      icon: Award
    },
    {
      year: 'Future',
      title: 'Expanding Horizons',
      description: 'Building more AI-powered tools to support entrepreneurs at every stage of their journey, from ideation to scale.',
      icon: Rocket
    }
  ];

  const team = [
    {
      name: 'Visionary Leaders',
      description: 'Experienced entrepreneurs and tech innovators who understand the challenges of building startups.',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'AI Experts',
      description: 'World-class machine learning engineers building intelligent tools for startup validation.',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Business Strategists',
      description: 'Former VCs and startup advisors bringing real-world investment insights to our platform.',
      icon: Target,
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
            <div className="icon-container icon-purple mx-auto mb-8">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              About
              <span className="ml-2 text-gradient-primary">
                PitchMint
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Empowering entrepreneurs to turn ideas into reality with AI-powered validation
            </p>
          </motion.div>

          <motion.div
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Our Story
              </h2>
              <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                PitchMint was born from a simple observation: countless brilliant startup ideas fail not because they lack potential, but because founders lack access to professional validation and investor-ready materials.
              </p>
              <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                As entrepreneurs ourselves, we experienced the frustration of spending weeks creating pitch decks, conducting market research, and preparing for investor meetings. We knew there had to be a better way.
              </p>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Today, PitchMint combines advanced AI technology with deep business expertise to give every entrepreneur access to the tools and insights that were once available only to well-funded startups with advisory teams.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6 text-center`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <div className={`text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent`}>
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
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-6`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start">
                    <div className={`icon-container bg-gradient-to-br ${value.color} mr-4 flex-shrink-0`}>
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {value.title}
                      </h3>
                      <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Journey
            </h2>
            <div className="relative">
              <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

              {journey.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`relative mb-8 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 + index * 0.2 }}
                >
                  <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6 md:max-w-md ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="flex items-center mb-4">
                      <div className={`icon-container ${index === 0 ? 'icon-yellow' : index === 1 ? 'icon-green' : index === 2 ? 'icon-purple' : 'icon-blue'} mr-3`}>
                        <milestone.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent`}>
                        {milestone.year}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {milestone.title}
                    </h3>
                    <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {milestone.description}
                    </p>
                  </div>
                  <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${darkMode ? 'bg-cyan-500' : 'bg-blue-600'} border-4 ${darkMode ? 'border-gray-900' : 'border-white'}`}></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} card-hover p-6 text-center`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`icon-container bg-gradient-to-br ${member.color} mx-auto mb-4`}>
                    <member.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8 text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.9 }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Join Our Mission
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Whether you're a first-time founder or a serial entrepreneur, we're here to support your journey from idea to launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = '/signup'}
                className="btn-primary btn-primary-cyan px-8 py-3 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Validating Free
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/contact'}
                className={`px-8 py-3 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 ${
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
