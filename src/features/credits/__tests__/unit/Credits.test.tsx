import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Credits from '@/features/credits/pages/Credits';
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

describe('Credits page component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPreloadedState = {
    auth: {
      user: {
        _id: 'user-1',
        email: 'founder@pitchmint.com',
        name: 'Founder',
        credits: 12,
        isPremium: false,
      },
      token: 'jwt-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    },
    credits: {
      plans: {
        starter: {
          name: 'Starter Pack',
          credits: 10,
          price: 199,
          description: 'Great for testing',
        },
        pro: {
          name: 'Pro Pack',
          credits: 50,
          price: 799,
          popular: true,
          description: 'For serious builders',
        },
      },
      loading: false,
      error: null,
      purchasingPlan: null,
      fetchedOnce: true,
    },
  };

  it('renders credit balance and available credit plans', () => {
    (api.get as any).mockResolvedValue({ data: { credits: 12 } });

    renderWithProviders(<Credits />, {
      preloadedState: mockPreloadedState as any,
    });

    expect(screen.getByRole('heading', { name: /Buy Credits/i })).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument(); // balance
    expect(screen.getByText('Starter Pack')).toBeInTheDocument();
    expect(screen.getByText('Pro Pack')).toBeInTheDocument();
  });

  it('handles demo purchase on dev environment', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    (api.get as any).mockResolvedValue({ data: { credits: 12 } });
    (api.post as any).mockResolvedValueOnce({
      data: {
        success: true,
        credits: 22,
        purchased: 10,
        planId: 'starter',
      },
    });

    renderWithProviders(<Credits />, {
      preloadedState: mockPreloadedState as any,
    });

    const demoButtons = screen.getAllByRole('button', { name: /Demo Purchase/i });
    if (demoButtons.length > 0) {
      fireEvent.click(demoButtons[0]);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/api/credits/simulate-payment-success', {
          planId: 'starter',
        });
        expect(alertMock).toHaveBeenCalledWith('Demo: Successfully added 10 credits!');
      });
    }

    alertMock.mockRestore();
  });

  it('renders error message when error state is set', () => {
    renderWithProviders(<Credits />, {
      preloadedState: {
        ...mockPreloadedState,
        credits: {
          ...mockPreloadedState.credits,
          error: 'Failed to process purchase',
        },
      } as any,
    });

    expect(screen.getByText('Failed to process purchase')).toBeInTheDocument();
  });
});
