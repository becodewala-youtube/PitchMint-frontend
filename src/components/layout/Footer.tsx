import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  
  return (
  <footer className={`relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-16`}>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className={`font-bold text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pitch<span className="text-purple-500">Mint</span>
            </span>
          </div>
          <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
            Validate your startup ideas with AI-powered analysis, generate professional pitch decks, and practice with virtual investors.
          </p>
          <div className="flex space-x-4">
            {['twitter', 'linkedin', 'github'].map((social) => (
              <div
                key={social}
                className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg`}
              >
                <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Links
          </h3>
          <ul className="space-y-3">
            {['Dashboard', 'Submit Idea', 'Saved Ideas', 'Investors'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300 hover:translate-x-1 inline-block`}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Support
          </h3>
          <ul className="space-y-3">
            {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300 hover:translate-x-1 inline-block`}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 md:mb-0`}>
            &copy; {new Date().getFullYear()} PitchMint. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
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