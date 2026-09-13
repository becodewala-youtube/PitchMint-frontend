import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogOut,
  Star,
  User,
  CreditCard,
  ChevronDown,
  Brain,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Target,
  Crown,
} from "lucide-react";
import { History as HistoryIcon } from "lucide-react";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import UpgradeModal from "../premium/UpgradeModal";
import icon from "../../assets/icon.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    if (isLandingPage) {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial position
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setScrolled(true);
    }
  }, [isLandingPage]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleInvestorsClick = () => {
    if (!user?.isPremium) {
      setShowUpgradeModal(true);
    } else {
      navigate("/investors");
    }
  };

  const navbarClasses = isLandingPage
    ? `fixed z-50 transition-all duration-500 ${
        scrolled
          ? "top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[1000px] rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-100"
          : "top-0 inset-x-0 w-full opacity-0 pointer-events-none -translate-y-4"
      }`
    : "fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10 transition-all duration-300";

  return (
    <>
      <nav className={navbarClasses}>
        <div className={isLandingPage && scrolled ? "px-6 w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                  <img src={icon} alt="logo" className="w-5 h-5" />
                </div>
                <span className="font-semibold text-[17px] tracking-tight text-white">
                  PitchMint
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-2 xl:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Dashboard
                  </Link>

                  {/* Tools Dropdown */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setShowToolsDropdown(true)}
                      onMouseLeave={() => setShowToolsDropdown(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                      Tools
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180 text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-0 mt-2 w-64 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10 bg-[#0a0a0a]/95 transition-all duration-300 overflow-hidden ${
                        showToolsDropdown
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                      onMouseEnter={() => setShowToolsDropdown(true)}
                      onMouseLeave={() => setShowToolsDropdown(false)}
                    >
                      <div className="p-3 bg-white/[0.02] border-b border-white/5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                          Startup Tools
                        </p>
                      </div>
                      
                      <div className="p-1">
                        <Link to="/submit-idea" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                          <Brain className="w-4 h-4 mr-3 text-purple-400 group-hover:text-purple-300" />
                          Submit Idea
                        </Link>
                        <Link to="/competitors" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                          <Users className="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" />
                          Competitors
                        </Link>
                        <Link to="/pitch-simulator" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                          <MessageSquare className="w-4 h-4 mr-3 text-emerald-400 group-hover:text-emerald-300" />
                          Pitch Arena
                        </Link>
                        <Link to="/market-research" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                          <TrendingUp className="w-4 h-4 mr-3 text-amber-400 group-hover:text-amber-300" />
                          Market Research
                        </Link>
                        <Link to="/investor-matching" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                          <Target className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-300" />
                          Investor Matching
                        </Link>
                        <Link to="/history" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                          <HistoryIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white" />
                          History
                        </Link>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleInvestorsClick}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      user?.isPremium
                        ? "text-gray-300 hover:text-white hover:bg-white/5"
                        : "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    }`}
                  >
                    {user?.isPremium ? <Star className="w-4 h-4 mr-1.5 fill-current" /> : <Crown className="w-4 h-4 mr-1.5" />}
                    Investors
                  </button>

                  {/* Credits Display */}
                  <Link
                    to="/credits"
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{user?.credits || 0}</span>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative group ml-2">
                    <button className="flex items-center px-2 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-7 h-7 rounded-full mr-2 object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full mr-2 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold border border-white/10">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="max-w-[100px] truncate">{user?.name}</span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10 bg-[#0a0a0a]/95 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-2">
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-400" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : isLandingPage ? (
                <div className="flex items-center gap-10">
                  <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-gray-300">
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
                    <a href="#blogs" className="hover:text-white transition-colors">Blogs</a>
                    <a href="#newsletter" className="hover:text-white transition-colors">Newsletter</a>
                  </div>
                  <Link
                    to="/signup"
                    className="flex gap-2 items-center justify-center px-6 py-2.5 rounded-full bg-[#6c28ff] hover:bg-[#5a1ec0] transition-colors duration-200 text-white font-semibold text-sm shadow-[0_0_20px_rgba(108,40,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-[#7c3aed]"
                  >
                    <span className="font-mono text-[13px] mr-1">{'>_'}</span>
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-full text-sm font-semibold bg-[#6c28ff] text-white hover:bg-[#5a1ec0] shadow-[0_0_20px_rgba(108,40,255,0.3)] transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="p-4 rounded-xl mb-4 bg-white/[0.02] border border-white/5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-bold text-white">
                          {user?.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {user?.isPremium && (
                            <div className="flex items-center text-purple-400">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              <span className="text-xs font-semibold">Pro</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-400">
                            <CreditCard className="w-3 h-3 mr-1" />
                            <span className="text-xs">{user?.credits || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Links */}
                  <Link to="/dashboard" onClick={toggleMenu} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Dashboard</Link>
                  <Link to="/submit-idea" onClick={toggleMenu} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Submit Idea</Link>
                  <Link to="/saved-ideas" onClick={toggleMenu} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Saved Ideas</Link>
                  <Link to="/competitors" onClick={toggleMenu} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Competitors</Link>
                  <Link to="/pitch-simulator" onClick={toggleMenu} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Pitch Arena</Link>
                  <Link to="/profile" onClick={toggleMenu} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5">Settings</Link>
                  
                  <button onClick={() => { handleLogout(); toggleMenu(); }} className="flex items-center w-full px-3 py-2.5 mt-4 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10">
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={toggleMenu} className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/5">
                    Log In
                  </Link>
                  <Link to="/signup" onClick={toggleMenu} className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-200">
                    Sign Up
                  </Link>
                </div>
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