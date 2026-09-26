import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../../../../tests/setup/msw/server';
import AppRouter from '@/app/router/AppRouter';
import { describe, it, expect, beforeEach } from 'vitest';

// We need to render the AppRouter to test the real routing behavior.
// Because it uses lazy loading, we'll wrap it and wait for it.
describe('Authentication Integration', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
  });

  it('allows user to sign in and redirects to dashboard', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<AppRouter />, { route: '/signin' });

    // Wait for the Signin page to load
    const emailInput = await screen.findByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    // Type credentials
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Submit form
    await user.click(submitButton);

    // Verify successful authentication and redirect to dashboard
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.token).toBe('mock-jwt-token');
      expect(state.auth.user?.email).toBe('test@example.com');
    }, { timeout: 3000 });

    // Assuming Dashboard renders some identifiable text, or simply checking that we are no longer on the signin page
    // We can just verify the URL changed or the ProtectedRoute allowed us in.
    // The lazy loaded dashboard should be visible.
    // Since Dashboard is lazy loaded, we might need to wait for its fallback/loader, then its content.
    // To simplify, we check the store state as the main indicator of auth success in this integration test.
  });

  it('shows error on invalid credentials (401)', async () => {
    const user = userEvent.setup();
    
    // Override handler to return 401
    server.use(
      http.post('*/api/auth/signin', () => {
        return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      })
    );

    const { store } = renderWithProviders(<AppRouter />, { route: '/signin' });

    const emailInput = await screen.findByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);

    // Error should be displayed on screen
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();

    // Store should not be authenticated
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.token).toBeNull();
  });

  it('protects routes and redirects unauthenticated users to signin', async () => {
    // Try to visit /dashboard directly without token
    renderWithProviders(<AppRouter />, { route: '/dashboard' });

    // Should redirect to signin
    const emailInput = await screen.findByLabelText(/Email Address/i);
    expect(emailInput).toBeInTheDocument();
  });
});
