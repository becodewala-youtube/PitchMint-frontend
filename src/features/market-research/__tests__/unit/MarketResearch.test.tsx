import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import MarketResearch from '../../pages/MarketResearch';
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

describe('MarketResearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMarketData = {
    tam: {
      value: 50000000000,
      description: 'Total global addressable fintech and banking software market.',
      sources: ['Gartner 2024', 'McKinsey Global Banking Report'],
    },
    sam: {
      value: 12000000000,
      description: 'Serviceable addressable market for automated bookkeeping in North America.',
      methodology: 'Bottom-up calculation based on SMB business registry.',
    },
    som: {
      value: 650000000,
      description: 'Serviceable obtainable market captured within first 36 months.',
      timeline: '3 Years',
    },
    trends: [
      { keyword: 'Autonomous Finance', interest: 92, growth: '+45% YoY' },
      { keyword: 'AI Invoicing', interest: 84, growth: '+28% YoY' },
    ],
    personas: [
      {
        name: 'Startup Founder Alex',
        demographics: {
          age: '28-35',
          income: '$90k - $140k',
          location: 'Urban / Tech Hubs',
          education: "Bachelor's Degree",
        },
        psychographics: {
          values: ['Speed', 'Cost efficiency'],
          interests: ['Tech gadgets', 'Entrepreneurship'],
          painPoints: ['Manual tax filing', 'Expensive accountants'],
        },
        behaviors: {
          buyingHabits: 'SaaS monthly subscriptions',
          mediaConsumption: 'Twitter, Hacker News',
          decisionFactors: ['Ease of use', 'Integration with Stripe'],
        },
      },
    ],
    competitorActivity: [
      {
        name: 'QuickBooks Pro',
        fundingRounds: 5,
        lastFunding: '$50M Series C',
        marketShare: '35%',
      },
    ],
  };

  it('renders input form with submit button disabled when fields are empty', () => {
    renderWithProviders(<MarketResearch />);

    expect(screen.getByText('Market Research')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your startup idea/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /generate market analysis/i });
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit button and fetches market research data on valid submission', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: mockMarketData,
    });

    renderWithProviders(<MarketResearch />, {
      preloadedState: {
        auth: {
          token: 'token-market',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'AI bookkeeping for SMBs' } });

    const [industrySelect, regionSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'Finance' } });
    fireEvent.change(regionSelect, { target: { value: 'North America' } });

    const submitBtn = screen.getByRole('button', { name: /generate market analysis/i });
    expect(submitBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/market-research/analyze',
      {
        ideaText: 'AI bookkeeping for SMBs',
        industry: 'Finance',
        targetRegion: 'North America',
      },
      { headers: { Authorization: 'Bearer token-market' } }
    );

    await waitFor(() => {
      expect(screen.getByText('Total Addressable Market')).toBeInTheDocument();
      expect(screen.getByText('Serviceable Addressable Market')).toBeInTheDocument();
      expect(screen.getByText('Serviceable Obtainable Market')).toBeInTheDocument();
      expect(screen.getByText('Autonomous Finance')).toBeInTheDocument();
      expect(screen.getByText('Startup Founder Alex')).toBeInTheDocument();
      expect(screen.getByText('QuickBooks Pro')).toBeInTheDocument();
    });
  });

  it('shows InsufficientCreditsModal on 402 payment required error', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 402,
        data: {
          creditsRequired: 2,
          creditsAvailable: 0,
        },
      },
    });

    renderWithProviders(<MarketResearch />);

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'No credits idea' } });

    const [industrySelect, regionSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'Technology' } });
    fireEvent.change(regionSelect, { target: { value: 'Global' } });

    const submitBtn = screen.getByRole('button', { name: /generate market analysis/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Insufficient Credits')).toBeInTheDocument();
    });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Insufficient Credits')).not.toBeInTheDocument();
  });

  it('displays error message on general API failure', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: 'AI research engine temporarily unavailable' },
      },
    });

    renderWithProviders(<MarketResearch />);

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'Sample research' } });

    const [industrySelect, regionSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'SaaS' } });
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });

    const submitBtn = screen.getByRole('button', { name: /generate market analysis/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('AI research engine temporarily unavailable')).toBeInTheDocument();
    });
  });
});
