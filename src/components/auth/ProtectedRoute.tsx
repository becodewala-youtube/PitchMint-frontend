// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser() as any);
    }
  }, [dispatch, token, isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
