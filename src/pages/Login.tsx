import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { RootState } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleSignIn from '../components/GoogleSignIn';
import Icon from '../assets/icon.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  

  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }) as any);
    
    if (result.error && result.payload?.emailNotVerified) {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } else if (!result.error) {
      navigate('/dashboard');
    }
  };



const handleGoogleSuccess = () => {
  
  navigate('/dashboard');
};

 const handleGoogleError = (error: string) => {
  setError(error);
};

  return (
    <div className={`page-container ${darkMode ? 'page-container-dark' : 'page-container-light'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      {/* Animated Background */}
      <div className="bg-animated">
        <div className={`bg-orb ${darkMode ? 'bg-orb-1' : 'bg-orb-light-1'}`}></div>
        <div className={`bg-orb ${darkMode ? 'bg-orb-2' : 'bg-orb-light-2'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 ${darkMode ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-purple-400 to-cyan-400'} animate-spin-slow`}></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`card-glass ${darkMode ? 'card-glass-dark' : 'card-glass-light'} px-5 py-6 sm:p-8`}
        >
          {/* Header */}
          <div className="text-center">
            <div className="icon-container  mx-auto mb-2 sm:mb-6">
             <img src={Icon} alt="login logo" />
            </div>
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} sm:mb-2`}>
              Welcome Back
            </h2>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
  <motion.div 
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative" 
    role="alert"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <span className="block sm:inline">{error}</span>
  </motion.div>
)}
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field  text-sm  ${darkMode ? 'input-field-dark' : 'input-field-light'}`}
                  placeholder="Email address"
                />
              </div>
              <div>
                <div className="relative">
  <label htmlFor="password" className="sr-only">
    Password
  </label>
  <input
    id="password"
    name="password"
    type={showPassword ? 'text' : 'password'}
    autoComplete="current-password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={`input-field  text-sm ${darkMode ? 'input-field-dark' : 'input-field-light'} pr-10`} // Add pr-10 for icon space
    placeholder="Password"
    
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
    tabIndex={-1} // optional to prevent tab focus on icon
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5 text-gray-500" />
    ) : (
      <Eye className="h-5 w-5 text-gray-500" />
    )}
  </button>
</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-cyan-600 hover:text-cyan-500 transition-colors duration-300"
              >
                Forgot your password?
              </Link>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary py-1 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'btn-primary-cyan'
                }`}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <GoogleSignIn onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

            <div className="text-center">
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

function setError(error: string) {
  throw new Error('Function not implemented.');
}
