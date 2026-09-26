import { screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppRouter from '@/app/router/AppRouter';
import { renderWithProviders } from '../../../../tests/setup/test-utils';

// ─── Mock the heavyweight Landing page so React.lazy/Suspense resolves ───────
// AppRouter uses React.lazy for all pages. Landing.tsx is ~38KB with framer-motion
// and a video asset — it will never resolve within test timeouts in jsdom.
// This test verifies routing correctness only; Landing's own render is covered
// by its own dedicated test suite.
vi.mock('@/features/landing/pages/Landing', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));

const unauthState = {
  auth: {
    loading: false,
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
  },
};

describe('AppRouter component', () => {
  it('renders landing page on root path "/"', async () => {
    await act(async () => {
      renderWithProviders(<AppRouter />, {
        route: '/',
        preloadedState: unauthState,
      });
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('renders NotFound page for unknown route', async () => {
    await act(async () => {
      renderWithProviders(<AppRouter />, {
        route: '/unknown-url-404',
        preloadedState: unauthState,
      });
    });

    await waitFor(
      () => {
        expect(screen.getByText('Error 404')).toBeInTheDocument();
        expect(screen.getByText('Lost in Space')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('redirects unauthenticated user to /signin when accessing protected /dashboard', async () => {
    await act(async () => {
      renderWithProviders(<AppRouter />, {
        route: '/dashboard',
        preloadedState: unauthState,
      });
    });

    await waitFor(
      () => {
        // Redirects to /signin which renders Sign In page
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
