import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PremiumRoute from '@/app/router/PremiumRoute';
import { renderWithProviders } from '../../../../tests/setup/test-utils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('PremiumRoute component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PageLoader when auth state is loading', () => {
    const { container } = renderWithProviders(
      <PremiumRoute>
        <div>Premium Feature Page</div>
      </PremiumRoute>,
      {
        preloadedState: {
          auth: {
            loading: true,
            user: null,
            token: 'token',
            isAuthenticated: true,
            error: null,
          },
        },
      }
    );

    expect(screen.queryByText('Premium Feature Page')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders children when user has isPremium = true', () => {
    renderWithProviders(
      <PremiumRoute>
        <div>Premium Feature Page</div>
      </PremiumRoute>,
      {
        preloadedState: {
          auth: {
            loading: false,
            user: { _id: '1', name: 'Premium User', email: 'vip@test.com', isPremium: true, credits: 100 },
            token: 'token',
            isAuthenticated: true,
            error: null,
          },
        },
      }
    );

    expect(screen.getByText('Premium Feature Page')).toBeInTheDocument();
  });

  it('renders paywall upgrade lock UI when user is not premium', () => {
    renderWithProviders(
      <PremiumRoute>
        <div>Premium Feature Page</div>
      </PremiumRoute>,
      {
        preloadedState: {
          auth: {
            loading: false,
            user: { _id: '1', name: 'Free User', email: 'free@test.com', isPremium: false, credits: 2 },
            token: 'token',
            isAuthenticated: true,
            error: null,
          },
        },
      }
    );

    expect(screen.queryByText('Premium Feature Page')).not.toBeInTheDocument();
    expect(screen.getByText('Unlock Investor Directory')).toBeInTheDocument();
    expect(screen.getByText('Premium Exclusive Feature')).toBeInTheDocument();
  });

  it('navigates to dashboard on clicking "Return to Dashboard"', () => {
    renderWithProviders(
      <PremiumRoute>
        <div>Premium Feature Page</div>
      </PremiumRoute>,
      {
        preloadedState: {
          auth: {
            loading: false,
            user: { _id: '1', name: 'Free User', email: 'free@test.com', isPremium: false, credits: 2 },
            token: 'token',
            isAuthenticated: true,
            error: null,
          },
        },
      }
    );

    const returnBtn = screen.getByRole('button', { name: /return to dashboard/i });
    fireEvent.click(returnBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('opens UpgradeModal when clicking "Upgrade Now"', () => {
    renderWithProviders(
      <PremiumRoute>
        <div>Premium Feature Page</div>
      </PremiumRoute>,
      {
        preloadedState: {
          auth: {
            loading: false,
            user: { _id: '1', name: 'Free User', email: 'free@test.com', isPremium: false, credits: 2 },
            token: 'token',
            isAuthenticated: true,
            error: null,
          },
        },
      }
    );

    const upgradeBtn = screen.getByRole('button', { name: /upgrade now/i });
    fireEvent.click(upgradeBtn);
    expect(screen.getByText(/Upgrade to Premium/i)).toBeInTheDocument();
  });
});
