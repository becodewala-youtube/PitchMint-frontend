import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '@/app/App';
import { renderWithProviders } from '../../../tests/setup/test-utils';
import * as authSlice from '@/features/auth/store/authSlice';

vi.mock('@/app/router', () => ({
  AppRouter: () => <div data-testid="mock-router">Router Rendered</div>,
}));

describe('App component (src/app/App.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds "dark" class to documentElement on mount', () => {
    renderWithProviders(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('dispatches loadUser when token exists and user is not loaded', () => {
    const loadUserSpy = vi.spyOn(authSlice, 'loadUser');

    renderWithProviders(<App />, {
      preloadedState: {
        auth: {
          token: 'existing-token',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(loadUserSpy).toHaveBeenCalled();
  });

  it('does not dispatch loadUser when token does not exist', () => {
    const loadUserSpy = vi.spyOn(authSlice, 'loadUser');

    renderWithProviders(<App />, {
      preloadedState: {
        auth: {
          token: null,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    expect(loadUserSpy).not.toHaveBeenCalled();
  });

  it('does not dispatch loadUser when user is already loaded', () => {
    const loadUserSpy = vi.spyOn(authSlice, 'loadUser');

    renderWithProviders(<App />, {
      preloadedState: {
        auth: {
          token: 'existing-token',
          user: { _id: '1', name: 'User', email: 'test@test.com', isPremium: false, credits: 5 },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(loadUserSpy).not.toHaveBeenCalled();
  });
});
