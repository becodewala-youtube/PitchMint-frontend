// src/components/auth/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;