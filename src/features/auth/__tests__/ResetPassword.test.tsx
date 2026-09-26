import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPassword from '@/features/auth/pages/ResetPassword';
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

describe('ResetPassword component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form inputs for email, token, new password, and confirm password', () => {
    renderWithProviders(<ResetPassword />);

    expect(screen.getByRole('heading', { name: /Reset Password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reset Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
  });

  it('displays client validation error if passwords do not match', async () => {
    renderWithProviders(<ResetPassword />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { name: 'email', value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Reset Code/i), {
      target: { name: 'token', value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/^New Password/i), {
      target: { name: 'newPassword', value: 'Secret123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { name: 'confirmPassword', value: 'Mismatch123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /Reset Password/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('submits valid form data and displays success view', async () => {
    (api.post as any).mockResolvedValueOnce({
      data: { message: 'Password reset successful' },
    });

    renderWithProviders(<ResetPassword />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { name: 'email', value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Reset Code/i), {
      target: { name: 'token', value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/^New Password/i), {
      target: { name: 'newPassword', value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { name: 'confirmPassword', value: 'NewPassword123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /Reset Password/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/reset-password', {
        email: 'user@example.com',
        token: '123456',
        newPassword: 'NewPassword123!',
      });
      expect(screen.getByText(/Password Reset Successfully!/i)).toBeInTheDocument();
    });
  });

  it('displays API error message on failure', async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: 'Invalid or expired reset token' } },
    });

    renderWithProviders(<ResetPassword />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { name: 'email', value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Reset Code/i), {
      target: { name: 'token', value: '000000' },
    });
    fireEvent.change(screen.getByLabelText(/^New Password/i), {
      target: { name: 'newPassword', value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { name: 'confirmPassword', value: 'NewPassword123!' },
    });

    const submitBtn = screen.getByRole('button', { name: /Reset Password/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid or expired reset token')).toBeInTheDocument();
    });
  });
});
