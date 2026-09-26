import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Signin from '@/features/auth/pages/Signin';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
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
      <button type="button" onClick={() => onError('Google OAuth Failed')}>Mock Google Error</button>
    </div>
  ),
}));

describe('Signin page component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signin form elements', () => {
    renderWithProviders(<Signin />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    renderWithProviders(<Signin />);
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    // Toggle button is inside password group
    const toggleButton = passwordInput.parentElement?.querySelector('button');
    expect(toggleButton).toBeTruthy();
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    }
  });

  it('submits form and navigates to /dashboard on fulfilled signin', async () => {
    const signinSpy = vi.spyOn(authSlice, 'signin').mockReturnValue((() => Promise.resolve({
      type: 'auth/signin/fulfilled',
      payload: { token: 'tok', user: { _id: '1' } },
    })) as any);

    renderWithProviders(<Signin />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(signinSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('navigates to /verify-email if rejected with emailNotVerified', async () => {
    vi.spyOn(authSlice, 'signin').mockReturnValue((() => Promise.resolve({
      type: 'auth/signin/rejected',
      payload: { emailNotVerified: true, message: 'Verify email first' },
    })) as any);

    renderWithProviders(<Signin />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'unverified@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'pass123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verify-email?email=unverified%40example.com');
    });
  });

  it('displays error alert from redux auth state', () => {
    renderWithProviders(<Signin />, {
      preloadedState: {
        auth: {
          loading: false,
          user: null,
          token: null,
          isAuthenticated: false,
          error: 'Invalid email or password',
        },
      },
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
  });

  it('handles Google sign-in callbacks', () => {
    renderWithProviders(<Signin />);

    fireEvent.click(screen.getByText('Mock Google Success'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

    fireEvent.click(screen.getByText('Mock Google Error'));
    expect(screen.getByRole('alert')).toHaveTextContent('Google OAuth Failed');
  });
});
