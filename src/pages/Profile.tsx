import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Camera, Save, AlertCircle, CheckCircle, Star, History, Eye, EyeOff, Sparkles, Zap, TrendingUp, X, Crown } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { loadUser } from '../store/slices/authSlice';

interface CreditTransaction {
  _id: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  createdAt: string;
}

const Profile = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creditHistory, setCreditHistory] = useState<CreditTransaction[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      setCreditBalance(user.credits || 0);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'credits') {
      fetchCreditHistory();
      fetchCreditBalance();
    }
  }, [activeTab]);

  const fetchCreditHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/credits/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreditHistory(response.data.transactions);
    } catch (err) {
      console.error('Failed to fetch credit history');
    }
  };

  const fetchCreditBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCreditBalance(response.data.credits);
    } catch (err) {
      console.error('Failed to fetch credit balance');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const updateData: any = {
        name: profileData.name,
      };

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await axios.put(`${API_URL}/api/auth/user`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.emailVerificationRequired) {
        setSuccess('Profile updated. Please verify your new email address.');
      } else {
        setSuccess('Profile updated successfully');
        dispatch(loadUser() as any);
      }

      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await axios.post(`${API_URL}/api/auth/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Profile picture updated successfully');
      dispatch(loadUser() as any);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-blue-600 to-cyan-600' },
    { id: 'security', label: 'Security', icon: Shield, gradient: 'from-green-600 to-emerald-600' },
    { id: 'credits', label: 'Credits', icon: CreditCard, gradient: 'from-amber-600 to-orange-600' }
  ];

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'purchase': return TrendingUp;
      case 'usage': return Zap;
      case 'bonus': return Star;
      default: return CreditCard;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return 'from-green-500 to-emerald-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-[#0a0118]' : 'bg-gray-50'}`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-blue-600/30 via-cyan-600/20 to-teal-600/30"
              : "bg-gradient-to-br from-blue-300/40 via-cyan-300/30 to-teal-300/40"
          }`}
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-fuchsia-600/30"
              : "bg-gradient-to-br from-purple-300/40 via-pink-300/30 to-fuchsia-300/40"
          }`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse ${
            darkMode
              ? "bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20"
              : "bg-gradient-to-br from-indigo-300/30 via-purple-300/20 to-pink-300/30"
          }`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>

        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-transparent via-blue-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-blue-200/10 to-transparent'}`} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />

        <div className="absolute top-20 left-[10%] w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-center">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl ${darkMode ? "shadow-blue-500/50" : "shadow-blue-500/30"}`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Profile{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Settings
                  </span>
                </h1>
                <p className={`text-xs md:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} font-medium flex items-center gap-2 justify-center`}>
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {(error || success) && (
          <motion.div 
            className={`mb-6 p-4 rounded-2xl ${
              error 
                ? darkMode ? 'bg-red-900/30 border border-red-500/30' : 'bg-red-50 border border-red-200'
                : darkMode ? 'bg-green-900/30 border border-green-500/30' : 'bg-green-50 border border-green-200'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${error ? 'from-red-600 to-pink-600' : 'from-green-600 to-emerald-600'} flex items-center justify-center flex-shrink-0`}>
                  {error ? <AlertCircle className="w-4 h-4 text-white" /> : <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-sm ${error ? (darkMode ? 'text-red-200' : 'text-red-700') : (darkMode ? 'text-green-200' : 'text-green-700')}`}>
                  {error || success}
                </span>
              </div>
              <button 
                onClick={() => { setError(''); setSuccess(''); }}
                className={`text-sm font-bold ${error ? (darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700') : (darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700')} transition-colors`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div 
            className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <label className={`absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              <h3 className={`text-lg font-black mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name}
              </h3>
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {user?.email}
              </p>
              {user?.isPremium && (
                <div className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Member
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl`
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-800/50'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Information
                  </h2>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-4 py-3 text-sm rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-800/50 text-white border-gray-700 focus:border-blue-500 focus:bg-gray-800'
                            : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:bg-gray-50'
                        } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className={`w-full px-4 py-3 text-sm rounded-xl border-2 transition-all duration-300 cursor-not-allowed opacity-70 ${
                          darkMode
                            ? 'bg-gray-800/30 text-gray-500 border-gray-700'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      />
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Email address cannot be changed
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-8 rounded-2xl text-sm font-bold text-white transition-all duration-300 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/50'
                    }`}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="w-5 h-5 mr-2" />
                        Update Profile
                      </div>
                    )}
                  </motion.button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-xl">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security Settings
                  </h2>
                </div>
                
                {user?.authProvider === 'google' ? (
                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-bold mb-1 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                          Google Account Security
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          Your account is secured by Google. Password changes should be made through your Google account settings.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="relative">
                      <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-4 py-3 text-sm rounded-xl border-2 transition-all duration-300 pr-12 ${
                          darkMode
                            ? 'bg-gray-800/50 text-white border-gray-700 focus:border-green-500 focus:bg-gray-800'
                            : 'bg-white text-gray-900 border-gray-300 focus:border-green-500 focus:bg-gray-50'
                        } focus:ring-4 focus:ring-green-500/20 focus:outline-none`}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(prev => !prev)}
                        className="absolute right-4 top-[46px] transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        {showNewPassword ? 
                          <EyeOff className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : 
                          <Eye className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        }
                      </button>
                    </div>

                    <div className="relative">
                      <label className={`block text-sm font-bold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm New Password
                      </label>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-4 py-3 text-sm rounded-xl border-2 transition-all duration-300 pr-12 ${
                          darkMode
                            ? 'bg-gray-800/50 text-white border-gray-700 focus:border-green-500 focus:bg-gray-800'
                            : 'bg-white text-gray-900 border-gray-300 focus:border-green-500 focus:bg-gray-50'
                        } focus:ring-4 focus:ring-green-500/20 focus:outline-none`}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        className="absolute right-4 top-[46px] transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? 
                          <EyeOff className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} /> : 
                          <Eye className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        }
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading || !profileData.newPassword}
                      className={`w-full py-4 px-8 rounded-2xl text-sm font-bold text-white transition-all duration-300 ${
                        loading || !profileData.newPassword
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:shadow-green-500/50'
                      }`}
                      whileHover={!(loading || !profileData.newPassword) ? { scale: 1.02 } : {}}
                      whileTap={!(loading || !profileData.newPassword) ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                          Updating...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Shield className="w-5 h-5 mr-2" />
                          Update Password
                        </div>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            )}

            {/* Credits Tab */}
            {activeTab === 'credits' && (
              <div className="space-y-6">
                {/* Credit Balance */}
                <div className={`${darkMode ? 'bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-yellow-600/10 border border-amber-500/20' : 'bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border border-amber-200'} rounded-3xl p-6 md:p-8`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-xl">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Credit Balance
                        </h2>
                        <div className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {creditBalance}
                          <span className={`text-lg ml-2 font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Credits
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-green-900/30 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className={`text-xs font-semibold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        Available Now
                      </span>
                    </div>
                  </div>
                  
                  <div className={`mt-6 p-4 rounded-2xl ${darkMode ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Credits reset monthly. Free users get 3 credits per month. Upgrade to premium for unlimited access!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Credit History */}
                <div className={`${darkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-white border border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                      <History className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Transaction History
                    </h3>
                  </div>
                  
                  {creditHistory.length > 0 ? (
                    <div className="space-y-4">
                      {creditHistory.map((transaction) => {
                        const TransactionIcon = getTransactionIcon(transaction.type);
                        return (
                          <motion.div
                            key={transaction._id}
                            className={`flex items-center justify-between p-5 rounded-2xl ${
                              darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                            } hover:scale-[1.02] transition-all duration-300`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getTransactionColor(transaction.type, transaction.amount)} flex items-center justify-center shadow-lg`}>
                                <TransactionIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {transaction.description}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className={`text-right`}>
                              <div className={`text-lg font-black ${
                                transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                              </div>
                              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {transaction.type}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <History className="w-8 h-8 text-white" />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        No Transactions Yet
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your credit transaction history will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;