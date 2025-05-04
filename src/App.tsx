import { Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTheme } from './contexts/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SubmitIdea = lazy(() => import('./pages/SubmitIdea'));
const IdeaResults = lazy(() => import('./pages/IdeaResults'));
const PitchDeck = lazy(() => import('./pages/PitchDeck'));
const Canvas = lazy(() => import('./pages/Canvas'));
const SavedIdeas = lazy(() => import('./pages/SavedIdeas'));
const InvestorContacts = lazy(() => import('./pages/InvestorContacts'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  const { darkMode } = useTheme();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            
<Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

          {/* ... existing routes */}
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/submit-idea" element={<ProtectedRoute><SubmitIdea /></ProtectedRoute>} />
            <Route path="/idea/:id" element={<ProtectedRoute><IdeaResults /></ProtectedRoute>} />
            <Route path="/pitch-deck/:id" element={<ProtectedRoute><PitchDeck /></ProtectedRoute>} />
            <Route path="/canvas/:id" element={<ProtectedRoute><Canvas /></ProtectedRoute>} />
            <Route path="/saved-ideas" element={<ProtectedRoute><SavedIdeas /></ProtectedRoute>} />
            <Route path="/investors" element={<ProtectedRoute><InvestorContacts /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;