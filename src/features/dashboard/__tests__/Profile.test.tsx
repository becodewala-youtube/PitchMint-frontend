import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '@/features/dashboard/pages/Profile';
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

describe('Profile component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPreloadedState = {
    auth: {
      user: {
        _id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        credits: 20,
        isPremium: false,
      },
      token: 'jwt-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    },
  };

  it('renders user details in profile tab', () => {
    renderWithProviders(<Profile />, {
      preloadedState: mockPreloadedState as any,
    });

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Profile/i })).toBeInTheDocument();
  });

  it('submits updated profile name successfully', async () => {
    (api.put as any).mockResolvedValueOnce({
      data: { message: 'Profile updated' },
    });

    renderWithProviders(<Profile />, {
      preloadedState: mockPreloadedState as any,
    });

    const nameInput = screen.getByDisplayValue('Jane Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Founder' } });

    const saveBtn = screen.getByRole('button', { name: /Update Profile/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/auth/user', {
        name: 'Jane Founder',
      });
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });

  it('switches to credits tab and loads credit transactions', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/api/credits/history') {
        return Promise.resolve({
          data: {
            transactions: [
              {
                _id: 'tx-1',
                type: 'purchase',
                amount: 10,
                description: 'Starter Pack Purchase',
                createdAt: '2026-03-01T10:00:00.000Z',
              },
            ],
          },
        });
      }
      if (url === '/api/credits/balance') {
        return Promise.resolve({ data: { credits: 20 } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithProviders(<Profile />, {
      preloadedState: mockPreloadedState as any,
    });

    const creditsTab = screen.getByRole('button', { name: /^Credits$/i });
    fireEvent.click(creditsTab);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/credits/history');
      expect(screen.getByText('Starter Pack Purchase')).toBeInTheDocument();
    });
  });
});
