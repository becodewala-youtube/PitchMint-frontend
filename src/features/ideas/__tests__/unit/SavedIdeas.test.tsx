import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SavedIdeas from '@/features/ideas/pages/SavedIdeas';
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

describe('SavedIdeas page component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIdeas = [
    {
      _id: 'idea-1',
      ideaText: 'AI Copilot for Legal Drafting',
      overallScore: 88,
      marketDemandScore: 90,
      competitionScore: 80,
      monetizationFeasibilityScore: 85,
      createdAt: '2026-03-01T10:00:00.000Z',
      analysis: {
        marketDemand: { score: 90, text: 'Strong demand' },
        competition: { score: 80, text: 'Moderate competition' },
        monetization: { score: 85, text: 'High willingness to pay' },
        overall: { score: 88, text: 'High potential' },
      },
    },
  ];

  it('renders saved ideas list when ideas are present', () => {
    renderWithProviders(<SavedIdeas />, {
      preloadedState: {
        idea: {
          ideas: mockIdeas,
          currentIdea: null,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    expect(screen.getByRole('heading', { name: /Your Startup Ideas/i })).toBeInTheDocument();
    expect(screen.getByText('AI Copilot for Legal Drafting')).toBeInTheDocument();
    expect(screen.getByText('88% Score')).toBeInTheDocument();
  });

  it('renders empty state when ideas array is empty and not loading', async () => {
    (api.get as any).mockResolvedValueOnce({ data: { ideas: [] } });

    renderWithProviders(<SavedIdeas />, {
      preloadedState: {
        idea: {
          ideas: [],
          currentIdea: null,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    await waitFor(() => {
      expect(screen.getByText('No Ideas Yet')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Your First Idea/i })).toBeInTheDocument();
    });
  });

  it('opens delete modal and deletes idea on confirmation', async () => {
    (api.delete as any).mockResolvedValueOnce({ data: { success: true } });

    renderWithProviders(<SavedIdeas />, {
      preloadedState: {
        idea: {
          ideas: mockIdeas,
          currentIdea: null,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    const deleteBtn = screen.getByRole('button', { name: /^Delete$/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole('heading', { name: 'Delete Idea' })).toBeInTheDocument();

    const confirmBtn = screen.getAllByRole('button', { name: /^Delete$/i })[1] || screen.getByText('Delete');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/api/idea/idea-1');
    });
  });

  it('renders error view when state has error', async () => {
    (api.get as any).mockRejectedValueOnce(new Error('Failed to fetch saved ideas from database'));

    renderWithProviders(<SavedIdeas />, {
      preloadedState: {
        idea: {
          ideas: [],
          currentIdea: null,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch saved ideas from database')).toBeInTheDocument();
    });
  });
});
