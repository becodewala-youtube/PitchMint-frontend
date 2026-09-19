import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/hooks';
import { RootState } from '@/app/store';

import { 
  User, 
  Shield, 
  CreditCard, 
  Camera, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  History, 
  Eye, 
  EyeOff, 
  Zap, 
  TrendingUp, 
  X, 
  Crown,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import api from '@/shared/lib/api';
import { loadUser } from '@/features/auth/store/authSlice';
import { getUserInitials } from '@/shared/utils/userAvatar.util';
import BackButton from '@/shared/components/ui/BackButton';

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
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

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
    if (!user) {
      dispatch(loadUser());
    } else {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      setCreditBalance(user.credits || 0);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (activeTab === 'credits') {
      fetchCreditHistory();
      fetchCreditBalance();
    }
  }, [activeTab]);

  const fetchCreditHistory = async () => {
    try {
      const response = await api.get('/api/credits/history');
      setCreditHistory(response.data.transactions);
    } catch {
      if (import.meta.env.DEV) console.error('Failed to fetch credit history');
    }
  };

  const fetchCreditBalance = async () => {
    try {
      const response = await api.get('/api/credits/balance');
      setCreditBalance(response.data.credits);
    } catch {
      if (import.meta.env.DEV) console.error('Failed to fetch credit balance');
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
      const updateData: Record<string, string> = {
        name: profileData.name,
      };

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await api.put('/api/auth/user', updateData);

      if (response.data.emailVerificationRequired) {
        setSuccess('Profile updated. Please verify your new email address.');
      } else {
        setSuccess('Profile updated successfully');
        dispatch(loadUser());
      }

      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to update profile'));
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
      await api.post('/api/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Profile picture updated successfully');
      dispatch(loadUser());
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to upload avatar'));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'credits', label: 'Credits', icon: CreditCard }
  ];

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'purchase': return TrendingUp;
      case 'usage': return Zap;
      case 'bonus': return Star;
      default: return CreditCard;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden text-white pt-24 sm:pt-28 pb-16 selection:bg-[#7c3aed]/30">
      {/* Subtle Dot Grid Background Pattern like Dashboard */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <BackButton fallbackUrl="/dashboard" />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg shadow-purple-950/20">
              <User className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-[20px] sm:text-[22px] font-semibold text-white tracking-tight">
                Profile Settings
              </h1>
              <p className="text-[11px] sm:text-[12px] text-gray-400 font-normal mt-0.5">
                Manage your account, security, and credit balance
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-[12px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError('')} 
              className="text-red-400 hover:text-red-300 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-[12px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
            <button 
              onClick={() => setSuccess('')} 
              className="text-emerald-400 hover:text-emerald-300 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1 rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-2xl space-y-4">
            {/* Profile Picture & User Info */}
            <div className="text-center pb-4 border-b border-white/5">
              <div className="relative inline-block">
                <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden relative">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).nextElementSibling;
                        if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center text-white text-lg font-bold ${user?.profilePicture ? 'hidden' : 'flex'}`}>
                    {getUserInitials(user?.name)}
                  </div>
                </div>
                <label className={`absolute -bottom-1 -right-1 w-6 h-6 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg flex items-center justify-center cursor-pointer transition-all shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Camera className="w-3 h-3 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              <h3 className="text-[13px] sm:text-[14px] font-semibold text-white mt-2.5 truncate">
                {user?.name}
              </h3>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email}
              </p>
              {user?.isPremium && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-2">
                  <Crown className="w-3 h-3" />
                  <span>Premium Member</span>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 rounded-[18px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 p-4 sm:p-5 shadow-2xl">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-[#7c3aed]" />
                  </div>
                  <h2 className="text-[13px] font-semibold text-white">
                    Profile Information
                  </h2>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 outline-none transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/5 bg-[#141414]/50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Email address cannot be changed
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:border-b-[4px] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)]"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Profile</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-[#7c3aed]" />
                  </div>
                  <h2 className="text-[13px] font-semibold text-white">
                    Security Settings
                  </h2>
                </div>
                
                {user?.authProvider === 'google' ? (
                  <div className="p-3.5 rounded-xl bg-[#141414] border border-white/5 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5 text-[#7c3aed]" />
                    </div>
                    <div>
                      <h3 className="text-[12px] font-semibold text-white mb-0.5">
                        Google Account Security
                      </h3>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Your account is secured by Google. Password changes should be managed through your Google account settings.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                          New Password
                        </label>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 outline-none transition-all pr-10"
                          placeholder="Enter new password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(prev => !prev)}
                          className="absolute right-3 top-[32px] text-gray-400 hover:text-gray-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-3 py-2 text-[12px] rounded-xl border border-white/10 bg-[#141414] text-white focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 outline-none transition-all pr-10"
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                          className="absolute right-3 top-[32px] text-gray-400 hover:text-gray-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !profileData.newPassword}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl border-b-[4px] border-[#3904a6] hover:translate-y-[2px] active:translate-y-[4px] active:border-b-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:border-b-[4px] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)]"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Credits Tab */}
            {activeTab === 'credits' && (
              <div className="space-y-4">
                {/* Credit Balance Card */}
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-[#7c3aed]" />
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Available Credits</div>
                      <div className="text-[20px] font-bold text-white tracking-tight leading-tight">
                        {creditBalance}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Active Balance</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-white/5 flex items-start gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7c3aed] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Credits reset monthly. Free plans receive 3 credits per month. Upgrade to explore additional analysis tools.
                  </p>
                </div>

                {/* Credit History */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md bg-[#141414] border border-white/10 flex items-center justify-center">
                      <History className="w-3 h-3 text-[#7c3aed]" />
                    </div>
                    <h3 className="text-[12px] font-semibold text-white">
                      Transaction History
                    </h3>
                  </div>
                  
                  {creditHistory.length > 0 ? (
                    <div className="space-y-2">
                      {creditHistory.map((transaction) => {
                        const TransactionIcon = getTransactionIcon(transaction.type);
                        const isPositive = transaction.amount > 0;
                        return (
                          <div
                            key={transaction._id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#141414] border border-white/5 hover:border-white/10 transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] border border-white/5 flex items-center justify-center">
                                <TransactionIcon className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-[11px] font-medium text-white truncate max-w-[200px] sm:max-w-xs">
                                  {transaction.description}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[12px] font-bold ${
                                isPositive ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {isPositive ? '+' : ''}{transaction.amount}
                              </span>
                              <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-medium">
                                {transaction.type}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-[#141414] rounded-xl border border-white/5">
                      <History className="w-5 h-5 text-gray-500 mx-auto mb-1.5" />
                      <p className="text-[11px] text-gray-400">
                        No transactions recorded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;