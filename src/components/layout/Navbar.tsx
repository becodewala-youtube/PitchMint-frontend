import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Menu, X, Moon, Sun, LogOut, Star } from 'lucide-react';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import UpgradeModal from '../premium/UpgradeModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <nav className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Pitch<span className="text-indigo-600">Mint</span>
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                    Dashboard
                  </Link>
                  <Link to="/submit-idea" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                    Submit Idea
                  </Link>
                  <Link to="/competitors" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                    Competitor
                  </Link>
                  <Link to="/pitch-simulator" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                  PitchArena
                  </Link>
                  <Link to="/saved-ideas" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                    Saved Ideas
                  </Link>
                  <button
                    onClick={handleInvestorsClick}
                    className={`px-3 py-2 text-sm font-medium flex items-center ${
                      user?.isPremium 
                        ? darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                        : 'text-yellow-500 hover:text-yellow-600'
                    }`}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Investors
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    <LogOut size={18} className="mr-1" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`px-3 py-2 text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} mr-2`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
 <div
  className={`sm:hidden fixed top-16 left-0 w-full z-50 transform transition-all duration-300 ease-in-out origin-top ${
    isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
  } ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
>
          <div className={`px-2 pt-2 pb-3 space-y-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/submit-idea" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleMenu}
                >
                  Submit Idea
                </Link>
                <Link 
                  to="/competitors" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleMenu}
                >
                  Competitors
                </Link>
                <Link 
                  to="/pitch-simulator" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleMenu}
                >
                  PitchArena
                </Link>
                <Link 
                  to="/saved-ideas" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleMenu}
                >
                  Saved Ideas
                </Link>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleInvestorsClick();
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                    user?.isPremium
                      ? darkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      : 'text-yellow-500 hover:bg-yellow-600'
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
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-700"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
};

export default Navbar;