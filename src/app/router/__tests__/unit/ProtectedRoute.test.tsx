import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProtectedRoute from '@/app/router/ProtectedRoute';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import { Routes, Route } from 'react-router-dom';

describe('ProtectedRoute component', () => {
  it('renders PageLoader when auth is loading', () => {
    const { container } = renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            loading: true,
            token: 'test-token',
            user: null,
            isAuthenticated: false,
            error: null,
          },
        },
      }
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders protected children when user is authenticated with token', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        preloadedState: {
          auth: {
            loading: false,
            token: 'valid-token',
            user: { _id: '1', name: 'User', email: 'test@example.com', isPremium: false, credits: 5 },
            isAuthenticated: true,
            error: null,
          },
        },
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /signin when user is not authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<div>Sign In Screen</div>} />
      </Routes>,
      {
        route: '/protected',
        preloadedState: {
          auth: {
            loading: false,
            token: null,
            user: null,
            isAuthenticated: false,
            error: null,
          },
        },
      }
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
  });
});
