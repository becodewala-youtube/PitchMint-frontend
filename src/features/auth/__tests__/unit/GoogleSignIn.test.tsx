import { describe, it, expect, vi, beforeEach } from 'vitest';
import GoogleSignIn from '@/features/auth/components/GoogleSignIn';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('GoogleSignIn component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Google sign-in container div', () => {
    const { container } = renderWithProviders(<GoogleSignIn />);
    const buttonDiv = container.querySelector('#google-signin-button');
    expect(buttonDiv).toBeInTheDocument();
  });

  it('initializes Google accounts SDK on script load', () => {
    const initializeMock = vi.fn();
    const renderButtonMock = vi.fn();

    (window as any).google = {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
        },
      },
    };

    renderWithProviders(<GoogleSignIn />);

    // Simulate script onload
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    expect(script).toBeInTheDocument();

    if (script && (script as any).onload) {
      (script as any).onload();
    }

    expect(initializeMock).toHaveBeenCalled();
    expect(renderButtonMock).toHaveBeenCalled();
  });

  it('handles successful Google credential authentication', async () => {
    let credentialCallback: (response: { credential: string }) => Promise<void> = () => Promise.resolve();

    (window as any).google = {
      accounts: {
        id: {
          initialize: vi.fn(({ callback }) => {
            credentialCallback = callback;
          }),
          renderButton: vi.fn(),
        },
      },
    };

    (api.post as any).mockResolvedValueOnce({
      data: {
        token: 'google-jwt-token',
        user: { _id: 'g-1', name: 'Google User', email: 'guser@gmail.com' },
      },
    });

    const onSuccess = vi.fn();
    renderWithProviders(<GoogleSignIn onSuccess={onSuccess} />);

    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script && (script as any).onload) {
      (script as any).onload();
    }

    // Trigger credential callback
    await credentialCallback({ credential: 'mock-google-credential' });

    expect(api.post).toHaveBeenCalledWith('/api/auth/google', {
      credential: 'mock-google-credential',
    });
    expect(localStorage.getItem('token')).toBe('google-jwt-token');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('handles Google credential authentication failure', async () => {
    let credentialCallback: (response: { credential: string }) => Promise<void> = () => Promise.resolve();

    (window as any).google = {
      accounts: {
        id: {
          initialize: vi.fn(({ callback }) => {
            credentialCallback = callback;
          }),
          renderButton: vi.fn(),
        },
      },
    };

    (api.post as any).mockRejectedValueOnce(new Error('Google OAuth failed'));

    const onError = vi.fn();
    renderWithProviders(<GoogleSignIn onError={onError} />);

    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script && (script as any).onload) {
      (script as any).onload();
    }

    await credentialCallback({ credential: 'bad-credential' });

    expect(onError).toHaveBeenCalledWith('Google OAuth failed');
  });
});
