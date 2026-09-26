import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmailVerification from '@/features/auth/pages/EmailVerification';
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

describe('EmailVerification component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email verification UI with email from searchParams', () => {
    renderWithProviders(<EmailVerification />, {
      route: '/verify-email?email=founder@pitchmint.com',
    });

    expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
    expect(screen.getByText('founder@pitchmint.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /Verify Email/i });
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit button only when 6 digits are entered', () => {
    renderWithProviders(<EmailVerification />, {
      route: '/verify-email?email=founder@pitchmint.com',
    });

    const input = screen.getByPlaceholderText('000000');
    const submitBtn = screen.getByRole('button', { name: /Verify Email/i });

    fireEvent.change(input, { target: { value: '1234' } });
    expect(submitBtn).toBeDisabled();

    fireEvent.change(input, { target: { value: '123456' } });
    expect(submitBtn).not.toBeDisabled();
  });

  it('submits verification code successfully and displays success screen', async () => {
    (api.post as any).mockResolvedValueOnce({
      data: {
        token: 'test-jwt',
        user: { _id: '1', email: 'founder@pitchmint.com', isEmailVerified: true },
      },
    });

    renderWithProviders(<EmailVerification />, {
      route: '/verify-email?email=founder@pitchmint.com',
    });

    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '123456' } });

    const submitBtn = screen.getByRole('button', { name: /Verify Email/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/verify-email', {
        email: 'founder@pitchmint.com',
        token: '123456',
      });
      expect(screen.getByText('Email Verified!')).toBeInTheDocument();
    });
  });

  it('displays error message on verification failure', async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: 'Invalid or expired code' } },
    });

    renderWithProviders(<EmailVerification />, {
      route: '/verify-email?email=founder@pitchmint.com',
    });

    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '999999' } });

    const submitBtn = screen.getByRole('button', { name: /Verify Email/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid or expired code')).toBeInTheDocument();
    });
  });

  it('resends verification email on click', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    (api.post as any).mockResolvedValueOnce({ data: { message: 'Code resent' } });

    renderWithProviders(<EmailVerification />, {
      route: '/verify-email?email=founder@pitchmint.com',
    });

    const resendBtn = screen.getByRole('button', { name: /Resend Code/i });
    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/resend-verification', {
        email: 'founder@pitchmint.com',
      });
      expect(alertMock).toHaveBeenCalledWith('Verification code resent successfully!');
    });

    alertMock.mockRestore();
  });
});
