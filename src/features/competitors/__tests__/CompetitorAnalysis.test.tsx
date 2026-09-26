import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import CompetitorAnalysis from '../pages/CompetitorAnalysis';
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

describe('CompetitorAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAnalysisResponse = {
    data: {
      summary: 'Strong growth in consumer fintech sector with high digital adoption.',
      competitors: [
        {
          name: 'FinTechPro',
          description: 'A leading digital banking alternative for small businesses.',
          swot: {
            strengths: ['Established brand', 'Large user base'],
            weaknesses: ['Slow customer support', 'High enterprise fees'],
            opportunities: ['Global market expansion'],
            threats: ['New agile AI competitors'],
          },
        },
      ],
    },
  };

  it('renders initial form with empty input and disabled submit button', () => {
    renderWithProviders(<CompetitorAnalysis />, {
      preloadedState: {
        auth: {
          token: 'test-token',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
          verificationSent: false,
        },
      },
    });

    expect(screen.getByText('Competitor Analysis')).toBeInTheDocument();
    expect(screen.getByText('Enter Your Startup Idea')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your startup idea/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /analyze competitors/i });
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('updates textarea and character counter when user types', () => {
    renderWithProviders(<CompetitorAnalysis />);

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'A mobile crypto payment solution' } });

    expect(textarea).toHaveValue('A mobile crypto payment solution');
    expect(screen.getByText('32 characters')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /analyze competitors/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it('successfully analyzes competitors and displays results with SWOT grid', async () => {
    vi.mocked(api.post).mockResolvedValueOnce(mockAnalysisResponse);

    renderWithProviders(<CompetitorAnalysis />, {
      preloadedState: {
        auth: {
          token: 'valid-token',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
          verificationSent: false,
        },
      },
    });

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'A revolutionary fintech app' } });

    const submitBtn = screen.getByRole('button', { name: /analyze competitors/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/competitors/analyze',
      { ideaText: 'A revolutionary fintech app' },
      { headers: { Authorization: 'Bearer valid-token' } }
    );

    await waitFor(() => {
      expect(screen.getByText('Analysis Complete!')).toBeInTheDocument();
    });

    expect(screen.getByText('1 Competitors Found')).toBeInTheDocument();
    expect(screen.getByText('Market Overview')).toBeInTheDocument();
    expect(screen.getByText(/Strong growth in consumer fintech/i)).toBeInTheDocument();
    expect(screen.getByText('FinTechPro')).toBeInTheDocument();
    expect(screen.getByText('Established brand')).toBeInTheDocument();
    expect(screen.getByText('Slow customer support')).toBeInTheDocument();
    expect(screen.getByText('Global market expansion')).toBeInTheDocument();
    expect(screen.getByText('New agile AI competitors')).toBeInTheDocument();
  });

  it('handles 402 payment required error by displaying InsufficientCreditsModal', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 402,
        data: {
          creditsRequired: 1,
          creditsAvailable: 0,
        },
      },
    });

    renderWithProviders(<CompetitorAnalysis />);

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'Startup with no credits' } });

    const submitBtn = screen.getByRole('button', { name: /analyze competitors/i });
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

  it('handles generic API error and allows dismissing error message', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: 'Server error occurred during competitor search' },
      },
    });

    renderWithProviders(<CompetitorAnalysis />);

    const textarea = screen.getByPlaceholderText(/describe your startup idea/i);
    fireEvent.change(textarea, { target: { value: 'Sample idea for error test' } });

    const submitBtn = screen.getByRole('button', { name: /analyze competitors/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Server error occurred during competitor search')).toBeInTheDocument();
    });

    const dismissBtn = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText('Server error occurred during competitor search')).not.toBeInTheDocument();
  });
});
