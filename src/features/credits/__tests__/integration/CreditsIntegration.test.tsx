import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import { server } from '../../../../../tests/setup/msw/server';
import { http, HttpResponse } from 'msw';
import AppRouter from '@/app/router/AppRouter';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Credits Integration', () => {
  const mockInitialState = {
    auth: {
      user: { _id: 'user123', name: 'Test User', email: 'test@example.com', credits: 10, isPremium: false },
      token: 'mock-jwt',
      isAuthenticated: true,
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('loads credit plans and updates user balance on render', async () => {
    const { store } = renderWithProviders(<AppRouter />, { 
      route: '/credits',
      preloadedState: mockInitialState 
    });

    // Wait for the plans to be fetched and displayed
    expect(await screen.findByText('Starter Plan')).toBeInTheDocument();
    expect(await screen.findByText('Pro Plan')).toBeInTheDocument();

    // Verify balance is updated from 10 to 25 based on the mock `/api/credits/balance`
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.user?.credits).toBe(25);
    });
  });

  it('displays error if credit plans fail to load', async () => {
    server.use(
      http.get('*/api/credits/plans', () => {
        return HttpResponse.json({ message: 'Failed to fetch plans' }, { status: 500 });
      })
    );

    renderWithProviders(<AppRouter />, { 
      route: '/credits',
      preloadedState: mockInitialState 
    });

    expect(await screen.findByText(/Failed to fetch plans/i)).toBeInTheDocument();
  });
});
