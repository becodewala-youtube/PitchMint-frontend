import { useTheme } from '../../contexts/ThemeContext';
import icon from '../../assets/icon.png'
import { Twitter, Linkedin, Github, Heart, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { Link } from "react-router-dom"

const Footer = () => {
  const { darkMode } = useTheme();

  const socialLinks = [
    {
      name: 'twitter',
      icon: Twitter,
      url: 'https://twitter.com/your_username',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      name: 'linkedin',
      icon: Linkedin,
      url: 'https://linkedin.com/in/your_username',
      gradient: 'from-blue-600 to-blue-400',
    },
    {
      name: 'github',
      icon: Github,
      url: 'https://github.com/your_username',
      gradient: 'from-gray-600 to-gray-400',
    },
  ];

  const quickLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Submit Idea", path: "/submit-idea" },
    { name: "Saved Ideas", path: "/saved-ideas" },
    { name: "Investors", path: "/investors" },
  ]
  
  return (
    <footer className={`relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'} pt-4 sm:pt-8 pb-5`}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orbs */}
       
         </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with CTA */}
        

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-1 sm:mb-3">
              <div className="w-12 h-12 rounded-xl  flex items-center justify-center mr-1 sm:mr-2">
                <img src={icon} alt="logo" className="w-7 h-7" />
              </div>
              <span className={`font-black text-md sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pitch<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Mint</span>
              </span>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Validate your startup ideas with AI-powered analysis, generate professional pitch decks, and practice with virtual investors.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map(({ name, icon: Icon, url, gradient }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-11 h-11 rounded-xl ${
                    darkMode ? 'bg-gray-900/50 border border-gray-800/50 hover:border-violet-500/50' : 'bg-white border border-gray-200 hover:border-violet-300'
                  } backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden`}
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
                  <Icon className={`w-5 h-5 relative z-10 ${darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors duration-300`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-sm md:text-md font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <div className="w-1.5 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full mr-3" />
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`group text-xs sm:text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300 flex items-center`}
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`text-sm md:text-md font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full mr-3" />
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'About Us', path: '/about' },
                { name: 'Terms of Service', path: '/terms' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`group text-xs sm:text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300 flex items-center`}
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
         {/*  <div>
            <h3 className={`text-base md:text-lg font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-3" />
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Email</p>
                  <a href="mailto:hello@pitchmint.com" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    hello@pitchmint.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Phone</p>
                  <a href="tel:+1234567890" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-3 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Location</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    San Francisco, CA
                  </p>
                </div>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Divider */}
        <div className={`h-px mb-8 ${darkMode ? 'bg-gradient-to-r from-transparent via-violet-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`} />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center md:text-left`}>
            &copy; {new Date().getFullYear()} PitchMint. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
            <Link to="/privacy" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-medium`}>
              Privacy
            </Link>
            <Link to="/shipping" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-medium`}>
              Shipping
            </Link>
            <Link to="/refund" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors font-medium`}>
              Refunds
            </Link>
            <span className={`flex items-center text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
              Made with <Heart className="w-4 h-4 mx-1.5 text-red-500 fill-current animate-pulse" /> for entrepreneurs
            </span>
          </div>
        </div>

        {/* Extra Bottom Badge */}
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200'}`}>
            <Sparkles className="w-4 h-4 text-violet-400 mr-2" />
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Empowering Entrepreneurs Worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;