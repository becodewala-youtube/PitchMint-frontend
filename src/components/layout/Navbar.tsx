import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Menu, X, Moon, Sun, LogOut, Star, User, CreditCard, ChevronDown, Brain, FileText, Users, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { History as HistoryIcon } from 'lucide-react';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import UpgradeModal from '../premium/UpgradeModal';
import icon from '../../assets/icon.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleInvestorsClick = () => {
    if (!user?.isPremium) {
      setShowUpgradeModal(true);
    } else {
      navigate('/investors');
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-8 h-8 rounded-xl  flex items-center justify-center mr-4">
              <img src={icon} alt="logo" />
            </div>
                <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-cyan-500 transition-colors duration-300`}>
                  Pitch<span className="text-cyan-500">Mint</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-2 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  {/* Tools Dropdown */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setShowToolsDropdown(true)}
                      onMouseLeave={() => setShowToolsDropdown(false)}
                      className={`flex items-center px-2 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        darkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      Tools
                      <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 ml-1" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute left-0 mt-2 w-56 rounded-xl shadow-lg transition-all duration-300 ${
                        showToolsDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'
                      } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border z-50`}
                      onMouseEnter={() => setShowToolsDropdown(true)}
                      onMouseLeave={() => setShowToolsDropdown(false)}
                    >
                      <Link
                        to="/submit-idea"
                        className={`flex items-center px-4 py-3 text-sm rounded-t-xl transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Brain className="w-4 h-4 mr-3" />
                        Submit Idea
                      </Link>
                      <Link
                        to="/competitors"
                        className={`flex items-center px-4 py-3 text-sm transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Users className="w-4 h-4 mr-3" />
                        Competitors
                      </Link>
                      <Link
                        to="/pitch-simulator"
                        className={`flex items-center px-4 py-3 text-sm transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 mr-3" />
                        Pitch Arena
                      </Link>
                      <Link
                        to="/market-research"
                        className={`flex items-center px-4 py-3 text-sm transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-3" />
                        Market Research
                      </Link>
                      <Link
                        to="/investor-matching"
                        className={`flex items-center px-4 py-3 text-sm rounded-b-xl transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Target className="w-4 h-4 mr-3" />
                        Investor Matching
                      </Link>
                      <Link
                        to="/history"
                        className={`flex items-center px-4 py-3 text-sm transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <HistoryIcon className="w-4 h-4 mr-3" />
                        History
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={handleInvestorsClick}
                    className={`flex items-center px-2 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      user?.isPremium 
                        ? darkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                        : 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    <Star className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
                    <span className="hidden xl:inline">Investors</span>
                  </button>
                  
                  {/* Credits Display */}
                  <Link
                    to="/credits"
                    className={`flex items-center px-2 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <CreditCard className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
                    <span className="text-xs xl:text-sm">{user?.credits || 0}</span>
                    <span className="hidden xl:inline ml-1">Credits</span>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <button className={`flex items-center px-2 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}>
                      {user?.profilePicture ? (
  <img 
    src={user.profilePicture} 
    alt="Profile" 
    className="w-6 h-6 rounded-full mr-2 object-cover"
    onError={(e) => {
      // If image fails, fallback to first letter
      e.currentTarget.style.display = 'none';
      e.currentTarget.insertAdjacentHTML(
        "afterend",
        `<div class="w-6 h-6 rounded-full mr-2 bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
           ${user?.name?.charAt(0).toUpperCase()}
         </div>`
      );
    }}
  />
) : (
  <div className="w-6 h-6 rounded-full mr-2 bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
    {user?.name?.charAt(0).toUpperCase()}
  </div>
)}

                      <span className="hidden xl:inline truncate max-w-20">{user?.name}</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border`}>
                      <Link
                        to="/profile"
                        className={`block px-4 py-3 text-sm rounded-t-xl transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-b-xl transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 xl:px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 mr-2 ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`lg:hidden border-t ${darkMode ? 'border-gray-700/50 bg-gray-900/95' : 'border-gray-200/50 bg-white/95'} backdrop-blur-md`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/submit-idea" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Submit Idea
                  </Link>
                  <Link 
                    to="/saved-ideas" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Saved Ideas
                  </Link>
                  <Link 
                    to="/submit-idea" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Submit Idea
                  </Link>
                  <Link 
                    to="/competitors" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Competitors
                  </Link>
                  <Link 
                    to="/pitch-simulator" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Pitch Arena
                  </Link>
                  <Link 
                    to="/market-research" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Market Research
                  </Link>
                  <Link 
                    to="/investor-matching" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Investor Matching
                  </Link>
                  <Link 
                    to="/history" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    History
                  </Link>
                  <Link 
                    to="/credits" 
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {user?.credits || 0} Credits
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      toggleMenu();
                      handleInvestorsClick();
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      user?.isPremium
                        ? darkMode 
                          ? 'text-white hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100/50'
                        : 'text-yellow-500 hover:bg-yellow-500/10'
                    }`}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Investors
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut size={18} className="mr-2" /> 
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      darkMode 
                        ? 'text-white hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 mx-2"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
};

export default Navbar;