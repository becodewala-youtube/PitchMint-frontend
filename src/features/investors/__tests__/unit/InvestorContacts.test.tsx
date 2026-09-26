import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import InvestorContacts from '../../pages/InvestorContacts';
import InvestorDirectorySkeleton from '../../components/InvestorSkeleton';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

describe('InvestorContacts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockInvestors = [
    {
      _id: 'inv-1',
      name: 'Apex Ventures',
      type: 'VC',
      industryFocus: ['Technology', 'AI/ML'],
      description: 'Early-stage tech venture capital firm.',
      location: 'San Francisco, CA',
      contactLink: 'https://apexventures.example.com',
      investmentRange: {
        min: 500000,
        max: 2000000,
      },
    },
    {
      _id: 'inv-2',
      name: 'Seed Angels Network',
      type: 'Angel',
      industryFocus: ['FinTech', 'SaaS'],
      description: 'Angel syndicate investing in pre-seed founders.',
      location: 'New York, NY',
      contactLink: 'https://seedangels.example.com',
      investmentRange: {
        min: 50000,
        max: 250000,
      },
    },
  ];

  it('renders InvestorDirectorySkeleton properly', () => {
    const { container } = renderWithProviders(<InvestorDirectorySkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders investor cards when loaded successfully', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: mockInvestors,
    });

    renderWithProviders(<InvestorContacts />, {
      preloadedState: {
        auth: {
          token: 'token-abc',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(api.get).toHaveBeenCalledWith('/api/investors', {
      headers: { Authorization: 'Bearer token-abc' },
    });

    await waitFor(() => {
      expect(screen.getByText('Apex Ventures')).toBeInTheDocument();
      expect(screen.getByText('Early-stage tech venture capital firm.')).toBeInTheDocument();
      expect(screen.getByText('Seed Angels Network')).toBeInTheDocument();
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    });
  });

  it('handles premium subscription error by showing upgrade button', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      response: {
        status: 403,
        data: { message: 'Premium subscription required to access investor directory' },
      },
    });

    renderWithProviders(<InvestorContacts />);

    await waitFor(() => {
      expect(screen.getByText(/Premium Access Required/i)).toBeInTheDocument();
    });

    const upgradeBtn = screen.getByRole('button', { name: /upgrade to premium/i });
    expect(upgradeBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(upgradeBtn);
    });

    expect(screen.getByText(/Upgrade Now - ₹29/i)).toBeInTheDocument();
  });

  it('handles general error message', async () => {
    vi.mocked(api.get).mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: 'Database connection failed' },
      },
    });

    renderWithProviders(<InvestorContacts />);

    await waitFor(() => {
      expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    });
  });
});
