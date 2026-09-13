import { useTheme } from '../../contexts/ThemeContext';
import icon from '../../assets/icon.png'
import { Twitter, Linkedin, Github, Heart } from 'lucide-react';
import { Link } from "react-router-dom"

const Footer = () => {
  const { darkMode } = useTheme();

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'LinkedIn', icon: Linkedin, url: '#' },
    { name: 'GitHub', icon: Github, url: '#' },
  ];

  const quickLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Submit Idea", path: "/submit-idea" },
    { name: "Saved Ideas", path: "/saved-ideas" },
    { name: "Investors", path: "/investors" },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/about' },
    { name: 'Terms of Service', path: '/terms' }
  ];
  
  return (
    <footer className={`relative overflow-hidden border-t ${darkMode ? 'bg-[#050505] border-gray-900' : 'bg-white border-gray-200'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img src={icon} alt="logo" className="w-6 h-6 mr-2" />
              <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pitch<span className="text-indigo-500">Mint</span>
              </span>
            </div>
            <p className={`text-sm max-w-sm leading-relaxed mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Validate your startup ideas with AI-powered analysis, generate professional pitch decks, and practice with virtual investors.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  className={`text-gray-400 hover:text-indigo-500 transition-colors`}
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Product
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'border-gray-900' : 'border-gray-100'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            &copy; {new Date().getFullYear()} PitchMint. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className={`${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              Privacy
            </Link>
            <Link to="/terms" className={`${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;