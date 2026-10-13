// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { ReactNode } from 'react';
import PageLoader from '@/shared/components/layout/PageLoader';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading, token } = useSelector((state: RootState) => state.auth);

  // If a valid token exists, render children directly to let the page component render
  // its native skeleton or content without a jarring spinner flash
  if (token) {
    return <>{children}</>;
  }

  // If still checking auth with no token yet, show loader
  if (loading) {
    return <PageLoader />;
  }

  return <Navigate to="/signin" />;
};

export default ProtectedRoute;
