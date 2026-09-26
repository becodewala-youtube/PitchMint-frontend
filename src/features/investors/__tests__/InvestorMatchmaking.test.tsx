import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import InvestorMatchmaking from '../pages/InvestorMatchmaking';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
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

describe('InvestorMatchmaking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMatches = [
    {
      _id: 'match-1',
      name: 'Future Horizons Fund',
      type: 'VC',
      industryFocus: ['Technology', 'AI/ML'],
      description: 'Focused on next-generation AI infrastructure and platforms.',
      location: 'Silicon Valley',
      contactLink: 'https://futurehorizons.example.com',
      investmentRange: {
        min: 1000000,
        max: 5000000,
      },
      matchScore: 94,
      matchReasons: ['Target industry aligned', 'Stage matches mandate'],
      recentInvestments: ['OpenAI competitor', 'Agentic Workflow Inc'],
      portfolioSize: 42,
    },
  ];

  it('renders criteria form with submit button disabled until industry and stage selected', () => {
    renderWithProviders(<InvestorMatchmaking />);

    expect(screen.getByText('Investor Matchmaking')).toBeInTheDocument();
    expect(screen.getByText(/AI-powered investor matching for your startup/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /find investor matches/i });
    expect(submitBtn).toBeDisabled();
  });

  it('fills criteria and submits matching request, displaying results', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { matches: mockMatches },
    });

    renderWithProviders(<InvestorMatchmaking />, {
      preloadedState: {
        auth: {
          token: 'token-xyz',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const [industrySelect, stageSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'Technology' } });
    fireEvent.change(stageSelect, { target: { value: 'Seed' } });

    const submitBtn = screen.getByRole('button', { name: /find investor matches/i });
    expect(submitBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/investors/match',
      expect.objectContaining({
        industry: 'Technology',
        stage: 'Seed',
      }),
      { headers: { Authorization: 'Bearer token-xyz' } }
    );

    await waitFor(() => {
      expect(screen.getByText('Future Horizons Fund')).toBeInTheDocument();
      expect(screen.getByText('94% Match')).toBeInTheDocument();
      expect(screen.getByText('Target industry aligned')).toBeInTheDocument();
      expect(screen.getByText('Stage matches mandate')).toBeInTheDocument();
      expect(screen.getByText('OpenAI competitor')).toBeInTheDocument();
    });
  });

  it('handles 402 Insufficient credits by displaying InsufficientCreditsModal', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 402,
        data: {
          creditsRequired: 2,
          creditsAvailable: 0,
        },
      },
    });

    renderWithProviders(<InvestorMatchmaking />);

    const [industrySelect, stageSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'Finance' } });
    fireEvent.change(stageSelect, { target: { value: 'Pre-Seed' } });

    const submitBtn = screen.getByRole('button', { name: /find investor matches/i });
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

  it('renders empty matches state when no investors match criteria', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { matches: [] },
    });

    renderWithProviders(<InvestorMatchmaking />);

    const [industrySelect, stageSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'Agriculture' } });
    fireEvent.change(stageSelect, { target: { value: 'Growth' } });

    const submitBtn = screen.getByRole('button', { name: /find investor matches/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('No Matches Found')).toBeInTheDocument();
    });
  });

  it('regression: safely handles response when matches is undefined without crashing', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {}, // no matches array
    });

    renderWithProviders(<InvestorMatchmaking />);

    const [industrySelect, stageSelect] = screen.getAllByRole('combobox');
    fireEvent.change(industrySelect, { target: { value: 'Technology' } });
    fireEvent.change(stageSelect, { target: { value: 'Seed' } });

    const submitBtn = screen.getByRole('button', { name: /find investor matches/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('No Matches Found')).toBeInTheDocument();
    });
  });
});
