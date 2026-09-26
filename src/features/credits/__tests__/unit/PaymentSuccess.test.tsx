import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaymentSuccess from '@/features/credits/pages/PaymentSuccess';
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

describe('PaymentSuccess component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders verifying payment message and checks session ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { type: 'credit_purchase' },
    });

    renderWithProviders(<PaymentSuccess />, {
      route: '/payment-success?session_id=sess_123',
    });

    expect(screen.getByText('Verifying Payment')).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/payment/verify/sess_123', expect.any(Object));
    });
  });

  it('displays error UI if session_id is missing', async () => {
    renderWithProviders(<PaymentSuccess />, {
      route: '/payment-success',
    });

    await waitFor(() => {
      expect(screen.getByText('Payment Verification Failed')).toBeInTheDocument();
      expect(screen.getByText('No session ID found')).toBeInTheDocument();
    });
  });

  it('displays error UI if payment verification API call rejects', async () => {
    (api.get as any).mockRejectedValueOnce(new Error('Session expired'));

    renderWithProviders(<PaymentSuccess />, {
      route: '/payment-success?session_id=sess_expired',
    });

    await waitFor(() => {
      expect(screen.getByText('Payment Verification Failed')).toBeInTheDocument();
      expect(screen.getByText('Session expired')).toBeInTheDocument();
    });
  });
});
