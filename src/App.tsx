import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from './store/hooks';
import { loadUser } from './store/slices/authSlice';
import { RootState } from './store';

// Components
import PageLayout from './components/layout/PageLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import PageLoader from './components/layout/PageLoader';
// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
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
const Profile = lazy(() => import('./pages/Profile'));
const Credits = lazy(() => import('./pages/Credits'));
const MarketResearch = lazy(() => import('./pages/MarketResearch'));
const InvestorMatchmaking = lazy(() => import('./pages/InvestorMatchmaking'));
const History = lazy(() => import('./pages/History'));
const CollaborativePitchDeck = lazy(() => import('./pages/CollaborativePitchDeck'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));



function App() {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Load user on app start if token exists
  useEffect(() => {
    let promise: any;
    if (token && !isAuthenticated) {
      promise = dispatch(loadUser());
    }
    return () => {
      if (promise) {
        promise.abort();
      }
    };
  }, [token, isAuthenticated, dispatch]);

  return (
    <PageLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Public Auth Routes - redirect to dashboard if already logged in */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/verify-email" element={<PublicRoute><EmailVerification /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          
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
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/competitors/:id" element={<ProtectedRoute><IdeaCompetitors /></ProtectedRoute>} />
          <Route path="/pitch-simulator/:id" element={<ProtectedRoute><IdeaPitchSimulator /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
          <Route path="/market-research" element={<ProtectedRoute><MarketResearch /></ProtectedRoute>} />
          <Route path="/investor-matching" element={<ProtectedRoute><InvestorMatchmaking /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/collaborative-pitch/:id" element={<ProtectedRoute><CollaborativePitchDeck /></ProtectedRoute>} />

          {/* Legal and Support Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageLayout>
  );
}

export default App;