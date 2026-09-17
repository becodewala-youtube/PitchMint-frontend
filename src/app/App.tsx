import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loadUser } from '@/features/auth/store/authSlice';
import PageLayout from '@/shared/components/layout/PageLayout';
import { AppRouter } from '@/app/router';

export function App() {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    // Only fetch user data if token exists and user is not already loaded
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
      <AppRouter />
    </PageLayout>
  );
}

export default App;
