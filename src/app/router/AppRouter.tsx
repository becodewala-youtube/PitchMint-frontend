import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Route Guards & Fallback
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import PremiumRoute from './PremiumRoute';
import PageLoader from '@/shared/components/layout/PageLoader';

// Lazy-loaded Pages - Features
const Landing = lazy(() => import('@/features/landing/pages/Landing'));

// Auth Feature
const Signin = lazy(() => import('@/features/auth/pages/Signin'));
const Signup = lazy(() => import('@/features/auth/pages/Signup'));
const EmailVerification = lazy(() => import('@/features/auth/pages/EmailVerification'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));

// Dashboard Feature
const Dashboard = lazy(() => import('@/features/dashboard/pages/Dashboard'));
const Profile = lazy(() => import('@/features/dashboard/pages/Profile'));
const History = lazy(() => import('@/features/dashboard/pages/History'));

// Ideas Feature
const SubmitIdea = lazy(() => import('@/features/ideas/pages/SubmitIdea'));
const IdeaResults = lazy(() => import('@/features/ideas/pages/IdeaResults'));
const SavedIdeas = lazy(() => import('@/features/ideas/pages/SavedIdeas'));

// Pitch Deck Feature
const PitchDeck = lazy(() => import('@/features/pitch-deck/pages/PitchDeck'));
const CollaborativePitchDeck = lazy(() => import('@/features/pitch-deck/pages/CollaborativePitchDeck'));

// Canvas Feature
const Canvas = lazy(() => import('@/features/canvas/pages/Canvas'));

// Investors Feature
const InvestorContacts = lazy(() => import('@/features/investors/pages/InvestorContacts'));
const InvestorMatchmaking = lazy(() => import('@/features/investors/pages/InvestorMatchmaking'));

// Competitors Feature
const CompetitorAnalysis = lazy(() => import('@/features/competitors/pages/CompetitorAnalysis'));
const IdeaCompetitors = lazy(() => import('@/features/competitors/pages/IdeaCompetitors'));

// Pitch Simulator Feature
const PitchSimulator = lazy(() => import('@/features/pitch-simulator/pages/PitchSimulator'));
const IdeaPitchSimulator = lazy(() => import('@/features/pitch-simulator/pages/IdeaPitchSimulator'));

// Credits Feature
const Credits = lazy(() => import('@/features/credits/pages/Credits'));
const PaymentSuccess = lazy(() => import('@/features/credits/pages/PaymentSuccess'));

// Market Research Feature
const MarketResearch = lazy(() => import('@/features/market-research/pages/MarketResearch'));

// Legal and Support Pages
const PrivacyPolicy = lazy(() => import('@/features/legal/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/features/legal/pages/TermsOfService'));
const RefundPolicy = lazy(() => import('@/features/legal/pages/RefundPolicy'));
const ShippingPolicy = lazy(() => import('@/features/legal/pages/ShippingPolicy'));
const HelpCenter = lazy(() => import('@/features/legal/pages/HelpCenter'));
const Contact = lazy(() => import('@/features/legal/pages/Contact'));
const About = lazy(() => import('@/features/legal/pages/About'));
const NotFound = lazy(() => import('@/features/legal/pages/NotFound'));

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Public Auth Routes */}
        <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><EmailVerification /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Feature Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/submit-idea" element={<ProtectedRoute><SubmitIdea /></ProtectedRoute>} />
        <Route path="/idea/:id" element={<ProtectedRoute><IdeaResults /></ProtectedRoute>} />
        <Route path="/pitch-deck/:id" element={<ProtectedRoute><PitchDeck /></ProtectedRoute>} />
        <Route path="/canvas/:id" element={<ProtectedRoute><Canvas /></ProtectedRoute>} />
        <Route path="/saved-ideas" element={<ProtectedRoute><SavedIdeas /></ProtectedRoute>} />
        <Route path="/investors" element={<ProtectedRoute><PremiumRoute><InvestorContacts /></PremiumRoute></ProtectedRoute>} />
        <Route path="/competitors" element={<ProtectedRoute><CompetitorAnalysis /></ProtectedRoute>} />
        <Route path="/pitch-simulator" element={<ProtectedRoute><PitchSimulator /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/competitors/:id" element={<ProtectedRoute><IdeaCompetitors /></ProtectedRoute>} />
        <Route path="/pitch-simulator/:id" element={<ProtectedRoute><IdeaPitchSimulator /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
        <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
        <Route path="/market-research" element={<ProtectedRoute><MarketResearch /></ProtectedRoute>} />
        <Route path="/investor-matching" element={<ProtectedRoute><PremiumRoute><InvestorMatchmaking /></PremiumRoute></ProtectedRoute>} />
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
  );
};

export default AppRouter;
