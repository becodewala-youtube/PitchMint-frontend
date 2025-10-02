import { useTheme } from '../../contexts/ThemeContext';
import icon from '../../assets/icon.png'
import { Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from "react-router-dom"

const Footer = () => {
  const { darkMode } = useTheme();


 const socialLinks = [
  {
    name: 'twitter',
    icon: Twitter,
    url: 'https://twitter.com/your_username',
    color: '#1DA1F2', // Twitter Blue
  },
  {
    name: 'linkedin',
    icon: Linkedin,
    url: 'https://linkedin.com/in/your_username',
    color: '#0077B5', // LinkedIn Blue
  },
  {
    name: 'github',
    icon: Github,
    url: 'https://github.com/your_username',
    color: '#0077B5', // GitHub Black
  },
];

const quickLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Submit Idea", path: "/submit-idea" },
  { name: "Saved Ideas", path: "/saved-ideas" },
  { name: "Investors", path: "/investors" },
]
  
  return (
  <footer className={`relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-6 pb-8 md:py-8`}>
    {/* Background Effects */}
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 ${darkMode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-400 to-purple-400'} animate-pulse`}></div>
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-10 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-green-400 to-blue-400'} animate-pulse delay-1000`}></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-xl  flex items-center justify-center mr-4">
              <img src={icon} alt="logo" />
            </div>
            <span className={`font-bold text-md md:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pitch<span className="text-cyan-500">Mint</span>
            </span>
          </div>
          <p className={`text-sm md:text-md mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
            Validate your startup ideas with AI-powered analysis, generate professional pitch decks, and practice with virtual investors.
          </p>
        <div className="flex space-x-4">
  {socialLinks.map(({ name, icon: Icon, url, color }) => (
    <a
      key={name}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 rounded-xl ${
        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
      } flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg`}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </a>
  ))}
</div>


        </div>
<div className='grid grid-cols-2 md:gap-16 '>
        {/* Quick Links */}
       <div>
  <h3 className={`text-sm md:text-md font-bold md:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
    Quick Links
  </h3>
  <ul className="md:space-y-3 space-y-2">
    {quickLinks.map((link) => (
      <li key={link.name}>
        <Link
          to={link.path}
          className={`text-xs md:text-md ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300 ease-in-out hover:translate-x-1 hover:tra inline-block`}
        >
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

        {/* Support */}
        <div>
          <h3 className={`text-sm md:text-md font-bold md:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Support
          </h3>
          <ul className="md:space-y-3">
            {[
              { name: 'Help Center', path: '/help' },
              { name: 'Contact Us', path: '/contact' },
              { name: 'Privacy Policy', path: '/privacy' },
              { name: 'Terms of Service', path: '/terms' }
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-xs md:text-md ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300 hover:translate-x-1 inline-block`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div></div>
      </div>

      {/* Bottom Bar */}
      <div className={`pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 md:mb-0`}>
            &copy; {new Date().getFullYear()} PitchMint. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link to="/privacy" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Privacy
            </Link>
            <Link to="/terms" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Terms
            </Link>
            <Link to="/refund" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Refunds
            </Link>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Made with ❤️ for entrepreneurs
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

};

export default Footer;