import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Signup from '@/features/auth/pages/Signup';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
import * as authSlice from '@/features/auth/store/authSlice';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/auth/components/GoogleSignIn', () => ({
  default: ({ onSuccess, onError }: { onSuccess: () => void; onError: (err: string) => void }) => (
    <div data-testid="google-signin-mock">
      <button type="button" onClick={onSuccess}>Mock Google Success</button>
      <button type="button" onClick={() => onError('Google signup failed')}>Mock Google Error</button>
    </div>
  ),
}));

describe('Signup page component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form fields', () => {
    renderWithProviders(<Signup />);

    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('shows error if password is less than 8 characters', () => {
    renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'short' } });

    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Password must be at least 8 characters long');
  });

  it('shows error if passwords do not match', () => {
    renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'mismatch456' } });

    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match');
  });

  it('dispatches register and navigates to /verify-email on success', async () => {
    const registerSpy = vi.spyOn(authSlice, 'register').mockReturnValue((() => Promise.resolve({
      type: 'auth/register/fulfilled',
      payload: { message: 'Verification email sent' },
    })) as any);

    renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alice Doe' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/verify-email?email=alice%40example.com');
    });
  });

  it('shows password length indicator when typing password', () => {
    renderWithProviders(<Signup />);

    expect(screen.queryByText('At Least 8 characters')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'pass' } });
    expect(screen.getByText('At Least 8 characters')).toBeInTheDocument();
  });

  it('handles Google signup callback', () => {
    renderWithProviders(<Signup />);

    fireEvent.click(screen.getByText('Mock Google Error'));
    expect(screen.getByRole('alert')).toHaveTextContent('Google signup failed');
  });
});
