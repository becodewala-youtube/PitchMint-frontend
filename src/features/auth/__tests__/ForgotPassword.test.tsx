import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ForgotPassword component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders forgot password form with email input and submit button', () => {
    renderWithProviders(<ForgotPassword />);

    expect(screen.getByText(/Forgot Password\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });

  it('submits email and renders success view on success', async () => {
    (api.post as any).mockResolvedValueOnce({
      data: { message: 'Reset email sent successfully' },
    });

    renderWithProviders(<ForgotPassword />);

    const input = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(input, { target: { value: 'user@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /Send Reset Link/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/forgot-password', {
        email: 'user@example.com',
      });
      expect(screen.getByText(/Check Your Email/i)).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /Continue to Reset Password/i })
      ).toHaveAttribute('href', '/reset-password');
    });
  });

  it('displays error message when API call fails', async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: 'User with this email does not exist' } },
    });

    renderWithProviders(<ForgotPassword />);

    const input = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(input, { target: { value: 'notfound@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /Send Reset Link/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('User with this email does not exist')).toBeInTheDocument();
    });
  });
});
