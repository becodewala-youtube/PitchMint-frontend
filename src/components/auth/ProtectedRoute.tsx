// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ReactNode } from 'react';
import PageLoader from '../layout/PageLoader';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, token } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <PageLoader />;
  }

  return token ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
