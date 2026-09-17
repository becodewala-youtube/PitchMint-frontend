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

  if (loading) {
    return <PageLoader />;
  }

  return token ? <>{children}</> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
