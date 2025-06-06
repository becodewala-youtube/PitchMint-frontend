import { Routes, Route, Outlet } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTheme } from './contexts/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';


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
const CompetitorAnalysis = lazy(() => import('./pages/CompetitorAnalysis'));
const PitchSimulator = lazy(() => import('./pages/PitchSimulator'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const IdeaCompetitors = lazy(() => import('./pages/IdeaCompetitors'));
const IdeaPitchSimulator = lazy(() => import('./pages/IdeaPitchSimulator'));

// Loading component
const PageLoader = () => {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-10 lg:px-20 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        {/* Title skeleton */}
        <div className="h-6 w-2/3 rounded bg-gray-300 dark:bg-gray-700"></div>

        {/* Section box skeletons */}
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow"
          >
            <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
            <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};


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
            <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
<Route
  path="/signup"
  element={
    <PublicRoute>
      <Signup />
    </PublicRoute>
  }
/>

            
            


          {/* ... existing routes */}
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/submit-idea" element={<ProtectedRoute><SubmitIdea /></ProtectedRoute>} />
            <Route path="/idea/:id" element={<ProtectedRoute><IdeaResults /></ProtectedRoute>} />
            <Route path="/pitch-deck/:id" element={<ProtectedRoute><PitchDeck /></ProtectedRoute>} />
            <Route path="/canvas/:id" element={<ProtectedRoute><Canvas /></ProtectedRoute>} />
            <Route path="/saved-ideas" element={<ProtectedRoute><SavedIdeas /></ProtectedRoute>} />
            <Route path="/investors" element={<ProtectedRoute><InvestorContacts /></ProtectedRoute>} />
            <Route path="/competitors" element={<ProtectedRoute><CompetitorAnalysis /></ProtectedRoute>} />
            <Route path="/pitch-simulator" element={<ProtectedRoute><PitchSimulator /></ProtectedRoute>} />
            <Route path="/competitors/:id" element={<ProtectedRoute><IdeaCompetitors /></ProtectedRoute>} />
            <Route path="/pitch-simulator/:id" element={<ProtectedRoute><IdeaPitchSimulator /></ProtectedRoute>} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;