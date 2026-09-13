// src/components/auth/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ReactNode } from 'react';
import PageLoader from '../layout/PageLoader';
interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // Show loading spinner while checking auth status
  if (loading) {
    return <PageLoader />;
  }

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;