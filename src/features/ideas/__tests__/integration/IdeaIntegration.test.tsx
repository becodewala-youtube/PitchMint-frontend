import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../../tests/setup/msw/server';
import AppRouter from '@/app/router/AppRouter';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Idea Submission Integration', () => {
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

  it('submits an idea successfully and redirects to idea results', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<AppRouter />, { 
      route: '/submit-idea',
      preloadedState: mockInitialState 
    });

    const textarea = await screen.findByPlaceholderText(/Example: A mobile app that uses AI/i);
    const submitBtn = screen.getByRole('button', { name: /Analyze Idea/i });

    await user.type(textarea, 'A new AI startup idea that revolutionizes everything we know about technology.');

    await user.click(submitBtn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.idea.currentIdea?._id).toBe('idea123');
    }, { timeout: 3000 });
  });

  it('shows insufficient credits modal on 402 error', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('*/api/idea/submit', () => {
        return HttpResponse.json({ 
          success: false, 
          message: 'Insufficient credits',
          creditsRequired: 1,
          creditsAvailable: 0
        }, { status: 402 });
      })
    );

    renderWithProviders(<AppRouter />, { 
      route: '/submit-idea',
      preloadedState: mockInitialState 
    });

    const textarea = await screen.findByPlaceholderText(/Example: A mobile app that uses AI/i);
    const submitBtn = screen.getByRole('button', { name: /Analyze Idea/i });

    await user.type(textarea, 'A new AI startup idea that revolutionizes everything.');
    await user.click(submitBtn);

    // Wait for the modal to show up
    expect(await screen.findByText(/Insufficient credits/i)).toBeInTheDocument();
  });

  it('displays error message on 500 server error', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('*/api/idea/submit', () => {
        return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      })
    );

    renderWithProviders(<AppRouter />, { 
      route: '/submit-idea',
      preloadedState: mockInitialState 
    });

    const textarea = await screen.findByPlaceholderText(/Example: A mobile app that uses AI/i);
    const submitBtn = screen.getByRole('button', { name: /Analyze Idea/i });

    await user.type(textarea, 'A new AI startup idea.');
    await user.click(submitBtn);

    expect(await screen.findByText(/Internal Server Error/i)).toBeInTheDocument();
  });
});
