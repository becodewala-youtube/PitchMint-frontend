import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
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
  Sparkles,
} from "lucide-react";
import { History as HistoryIcon } from "lucide-react";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import UpgradeModal from "../premium/UpgradeModal";
import icon from "../../assets/icon.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode
            ? "bg-[#0a0118]/70 border-violet-500/10"
            : "bg-white/90 border-gray-200/50"
        }`}
      >
        {/* Gradient Glow Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 left-1/4 w-96 h-24 blur-3xl opacity-20 ${darkMode ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600' : 'bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300'}`} />
          <div className={`absolute top-0 right-1/4 w-96 h-24 blur-3xl opacity-20 ${darkMode ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600' : 'bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300'}`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 rounded-xl   flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <img src={icon} alt="logo" className="w-6 h-6" />
                </div>
                <span
                  className={`font-black text-xl ${darkMode ? "text-white" : "text-gray-900"} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300`}
                >
                  Pitch<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Mint</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`relative px-3 xl:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                      darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                    <span className="relative">Dashboard</span>
                  </Link>

                  {/* Tools Dropdown */}
                  <div className="relative group">
                    <button
                      onMouseEnter={() => setShowToolsDropdown(true)}
                      onMouseLeave={() => setShowToolsDropdown(false)}
                      className={`relative flex items-center px-3 xl:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                        darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                      <span className="relative flex items-center">
                        Tools
                        <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-0 mt-2 w-64 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden ${
                        showToolsDropdown
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      } ${darkMode ? "bg-gray-900/95 border-violet-500/20" : "bg-white/95 border-gray-200"}`}
                      onMouseEnter={() => setShowToolsDropdown(true)}
                      onMouseLeave={() => setShowToolsDropdown(false)}
                    >
                      {/* Gradient header */}
                      <div className="p-3 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border-b border-violet-500/20">
                        <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Startup Tools
                        </p>
                      </div>
                      
                      <div className="p-1">
                        <Link
                          to="/submit-idea"
                          className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <span>Submit Idea</span>
                        </Link>
                        <Link
                          to="/competitors"
                          className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-3 h-3 text-white" />
                          </div>
                          <span>Competitors</span>
                        </Link>
                        <Link
                          to="/pitch-simulator"
                          className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquare className="w-3 h-3 text-white" />
                          </div>
                          <span>Pitch Arena</span>
                        </Link>
                        <Link
                          to="/market-research"
                          className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-3 h-3 text-white" />
                          </div>
                          <span>Market Research</span>
                        </Link>
                        <Link
                          to="/investor-matching"
                          className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <Target className="w-3 h-3 text-white" />
                          </div>
                          <span>Investor Matching</span>
                        </Link>
                        <Link
                          to="/history"
                          className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <HistoryIcon className="w-3 h-3 text-white" />
                          </div>
                          <span>History</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleInvestorsClick}
                    className={`relative flex items-center px-3 xl:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                      user?.isPremium
                        ? darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-700 hover:text-gray-900"
                        : "text-amber-400 hover:text-amber-300"
                    }`}
                  >
                    <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${user?.isPremium ? (darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100') : 'bg-gradient-to-r from-amber-600/10 to-orange-600/10'}`} />
                    <span className="relative flex items-center">
                      {user?.isPremium ? <Star className="w-4 h-4 mr-1.5 fill-current" /> : <Crown className="w-4 h-4 mr-1.5" />}
                      <span className="hidden xl:inline">Investors</span>
                    </span>
                  </button>

                  {/* Credits Display */}
                  <Link
                    to="/credits"
                    className={`relative flex items-center px-3 xl:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                      darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                    <span className="relative flex items-center">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform duration-300">
                        <CreditCard className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-bold">{user?.credits || 0}</span>
                      <span className="hidden xl:inline ml-1.5">Credits</span>
                    </span>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative group">
                    <button
                      className={`relative flex items-center px-2 xl:px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                        darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                      <span className="relative flex items-center">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-8 h-8 rounded-xl mr-2 object-cover ring-2 ring-violet-500/20 group-hover:ring-violet-500/50 transition-all duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = document.createElement("div");
                              fallback.className = "w-8 h-8 rounded-xl mr-2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-violet-500/20 group-hover:ring-violet-500/50 transition-all duration-300";
                              fallback.textContent = user?.name?.charAt(0).toUpperCase() || "U";
                              e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl mr-2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-violet-500/20 group-hover:ring-violet-500/50 transition-all duration-300 shadow-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="hidden xl:inline truncate max-w-24 font-semibold">
                          {user?.name}
                        </span>
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-2 ${
                        darkMode
                          ? "bg-gray-900/95 border-violet-500/20"
                          : "bg-white/95 border-gray-200"
                      }`}
                    >
                    

                      <div className="p-2">
                        <Link
                          to="/profile"
                          className={`flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                            darkMode
                              ? "text-gray-300 hover:text-white hover:bg-violet-600/10"
                              : "text-gray-700 hover:text-gray-900 hover:bg-violet-50"
                          }`}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-red-500 hover:bg-red-500/10`}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`relative px-4 xl:px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                      darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                    <span className="relative">Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white text-sm font-bold transition-all duration-300 hover:scale-105 group shadow-lg hover:shadow-xl hover:shadow-violet-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Sparkles className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              )}
              <button
                onClick={toggleDarkMode}
                className={`relative p-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                <span className="relative block group-hover:scale-110 transition-transform duration-300">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden gap-2">
              <button
                onClick={toggleDarkMode}
                className={`relative p-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                <span className="relative block">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </span>
              </button>
              <button
                onClick={toggleMenu}
                className={`relative p-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                  darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10' : 'bg-gradient-to-r from-violet-100 to-fuchsia-100'}`} />
                <span className="relative block">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className={`lg:hidden border-t backdrop-blur-xl ${darkMode ? "border-violet-500/10 bg-[#0a0118]/95" : "border-gray-200/50 bg-white/95"}`}
          >
            <div className="px-4 pt-4 pb-3 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* User Profile Section */}
                  <div className={`p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200'}`}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {user?.isPremium && (
                            <div className="flex items-center">
                              <Crown className="w-3 h-3 text-amber-400 mr-1" />
                              <span className="text-xs font-semibold text-amber-400">Premium</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <CreditCard className="w-3 h-3 text-emerald-400 mr-1" />
                            <span className="text-xs font-semibold text-emerald-400">{user?.credits || 0} Credits</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/submit-idea"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <Brain className="w-4 h-4 mr-3" />
                    Submit Idea
                  </Link>
                  <Link
                    to="/saved-ideas"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Saved Ideas
                  </Link>
                  <Link
                    to="/competitors"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <Users className="w-4 h-4 mr-3" />
                    Competitors
                  </Link>
                  <Link
                    to="/pitch-simulator"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Pitch Arena
                  </Link>
                  <Link
                    to="/market-research"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <TrendingUp className="w-4 h-4 mr-3" />
                    Market Research
                  </Link>
                  <Link
                    to="/investor-matching"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <Target className="w-4 h-4 mr-3" />
                    Investor Matching
                  </Link>
                  <Link
                    to="/history"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <HistoryIcon className="w-4 h-4 mr-3" />
                    History
                  </Link>
                  <button
                    onClick={() => {
                      toggleMenu();
                      handleInvestorsClick();
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      user?.isPremium
                        ? darkMode
                          ? "text-white hover:bg-violet-600/10"
                          : "text-gray-700 hover:bg-violet-50"
                        : "text-amber-400 hover:bg-amber-500/10"
                    }`}
                  >
                    {user?.isPremium ? <Star className="w-4 h-4 mr-3 fill-current" /> : <Crown className="w-4 h-4 mr-3" />}
                    Investors
                  </button>
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-all duration-300 mt-2"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      darkMode
                        ? "text-white hover:bg-violet-600/10"
                        : "text-gray-700 hover:bg-violet-50"
                    }`}
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 mt-2"
                    onClick={toggleMenu}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
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