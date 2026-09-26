import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AppRouter from '@/app/router/AppRouter';
import { renderWithProviders } from '../../../../tests/setup/test-utils';

describe('AppRouter component', () => {
  it('renders landing page on root path "/"', async () => {
    renderWithProviders(<AppRouter />, {
      route: '/',
      preloadedState: {
        auth: {
          loading: false,
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Check Pro/i)).toBeInTheDocument();
    });
  });

  it('renders NotFound page for unknown route', async () => {
    renderWithProviders(<AppRouter />, {
      route: '/unknown-url-404',
      preloadedState: {
        auth: {
          loading: false,
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Error 404')).toBeInTheDocument();
      expect(screen.getByText('Lost in Space')).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated user to /signin when accessing protected /dashboard', async () => {
    renderWithProviders(<AppRouter />, {
      route: '/dashboard',
      preloadedState: {
        auth: {
          loading: false,
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        },
      },
    });

    await waitFor(() => {
      // Redirects to /signin which renders Sign In page
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });
  });
});
