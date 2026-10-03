import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import * as Sentry from '@sentry/react';
import { loadUser } from '@/features/auth/store/authSlice';
import PageLayout from '@/shared/components/layout/PageLayout';
import { AppRouter } from '@/app/router';

export function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Sentry.setUser({ id: (user as any)._id, email: (user as any).email });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  useEffect(() => {
    // Fetch user data if token exists and user object is not yet loaded
    let promise: { abort: () => void } | undefined;
    if (token && !user) {
      promise = dispatch(loadUser());
    }
    return () => {
      if (promise) {
        promise.abort();
      }
    };
  }, [token, user, dispatch]);

  return (
    <PageLayout>
      <AppRouter />
    </PageLayout>
  );
}

export default App;
