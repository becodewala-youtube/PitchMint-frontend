import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, CreditCard, Camera, Save, AlertCircle, CheckCircle, Star, History } from 'lucide-react';
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
      return;
    }

    try {
      const updateData: any = {
        name: profileData.name,
        email: profileData.email
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB)
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'credits', label: 'Credits', icon: CreditCard }
  ];

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'}`}>
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
      </div>

      <div className="content-wrapper">
        <div className="max-container">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`page-title ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Profile
              <span className="block text-gradient-primary">
                Settings
              </span>
            </h1>
            <p className={`page-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage your account and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div 
              className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-6`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Profile Picture */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className={`absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
                <h3 className={`text-lg font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.email}
                </p>
                {user?.isPremium && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700/50'
                          : 'text-gray-700 hover:bg-gray-100/50'
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
              {/* Alerts */}
              {(error || success) && (
                <motion.div 
                  className={`mb-6 p-4 rounded-2xl border ${
                    error 
                      ? 'bg-red-100 border-red-200 text-red-700' 
                      : 'bg-green-100 border-green-200 text-green-700'
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center">
                    {error ? (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {error || success}
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}>
                  <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Information
                  </h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                          disabled={user?.authProvider === 'google'}
                        />
                        {user?.authProvider === 'google' && (
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Email cannot be changed for Google accounts
                          </p>
                        )}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className={`btn-primary btn-primary-purple ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      whileHover={!loading ? { scale: 1.05 } : {}}
                      whileTap={!loading ? { scale: 0.95 } : {}}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="loading-spinner mr-2" />
                          Updating...
                        </div>
                      ) : (
                        <div className="flex items-center">
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
                <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}>
                  <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security Settings
                  </h2>
                  
                  {user?.authProvider === 'google' ? (
                    <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                      <div className="flex items-center">
                        <Shield className="w-6 h-6 text-blue-500 mr-3" />
                        <div>
                          <h3 className={`font-semibold ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                            Google Account
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                            Your account is secured by Google. Password changes should be made through your Google account.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`input-field ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading || !profileData.newPassword}
                        className={`btn-primary btn-primary-green ${(loading || !profileData.newPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        whileHover={!(loading || !profileData.newPassword) ? { scale: 1.05 } : {}}
                        whileTap={!(loading || !profileData.newPassword) ? { scale: 0.95 } : {}}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="loading-spinner mr-2" />
                            Updating...
                          </div>
                        ) : (
                          <div className="flex items-center">
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
                  <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Credit Balance
                      </h2>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {creditBalance}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Credits Available
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                      <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Credits reset monthly. Free users get 3 credits per month. Upgrade for more credits!
                      </p>
                    </div>
                  </div>

                  {/* Credit History */}
                  <div className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} p-8`}>
                    <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                      <History className="w-6 h-6 mr-2" />
                      Transaction History
                    </h3>
                    
                    {creditHistory.length > 0 ? (
                      <div className="space-y-4">
                        {creditHistory.map((transaction) => (
                          <div
                            key={transaction._id}
                            className={`flex items-center justify-between p-4 rounded-2xl ${
                              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}
                          >
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {transaction.description}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {new Date(transaction.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`font-bold ${
                              transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No transactions yet
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;