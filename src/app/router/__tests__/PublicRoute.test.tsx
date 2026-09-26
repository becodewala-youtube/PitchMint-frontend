import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PublicRoute from '@/app/router/PublicRoute';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
import { Routes, Route } from 'react-router-dom';

describe('PublicRoute component', () => {
  it('renders children when user is not authenticated', () => {
    renderWithProviders(
      <PublicRoute>
        <div>Public Signin Content</div>
      </PublicRoute>,
      {
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

    expect(screen.getByText('Public Signin Content')).toBeInTheDocument();
  });

  it('redirects to /dashboard when user is already authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <div>Public Signin Content</div>
            </PublicRoute>
          }
        />
        <Route path="/dashboard" element={<div>Dashboard Screen</div>} />
      </Routes>,
      {
        route: '/signin',
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

    expect(screen.queryByText('Public Signin Content')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard Screen')).toBeInTheDocument();
  });
});
