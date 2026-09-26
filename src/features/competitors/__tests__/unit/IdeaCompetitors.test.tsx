import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import IdeaCompetitors from '../../pages/IdeaCompetitors';
import CompetitorAnalysisSkeleton from '../../components/CompetitorSkeleton';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import api from '@/shared/lib/api';
import * as ideaSlice from '@/features/ideas/store/ideaSlice';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

describe('IdeaCompetitors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ideaSlice, 'getIdea').mockReturnValue({
      type: 'idea/getIdea/fulfilled',
      payload: {},
      unwrap: () => Promise.resolve({}),
    } as any);
  });

  const mockCompetitorData = {
    summary: 'The competitive landscape is crowded with legacy players.',
    competitors: [
      {
        name: 'LegacyCorp',
        description: 'Established provider of enterprise software.',
        swot: {
          strengths: ['Brand loyalty', 'High switching costs'],
          weaknesses: ['Outdated UI', 'Slow updates'],
          opportunities: ['Modernization'],
          threats: ['New modern startups'],
        },
      },
    ],
  };

  const mockIdeaWithCompetitors = {
    _id: 'idea-456',
    title: 'Enterprise AI Suite',
    description: 'Next-gen enterprise automation',
    category: 'ai',
    competitorAnalysis: mockCompetitorData,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  };

  it('renders CompetitorAnalysisSkeleton properly', () => {
    const { container } = renderWithProviders(<CompetitorAnalysisSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders skeleton loader when loading is true', () => {
    renderWithProviders(<IdeaCompetitors />, {
      routePath: '/idea/:id/competitors',
      initialEntries: ['/idea/idea-456/competitors'],
      preloadedState: {
        idea: {
          currentIdea: null,
          loading: true,
          error: null,
          creditError: null,
          ideas: [],

        },
      },
    });

    expect(screen.queryByText('Competitor Analysis')).not.toBeInTheDocument();
  });

  it('renders error state when error is present', () => {
    // IdeaCompetitors sets its local error state
    renderWithProviders(<IdeaCompetitors />, {
      routePath: '/idea/:id/competitors',
      initialEntries: ['/idea/idea-456/competitors'],
      preloadedState: {
        idea: {
          currentIdea: null,
          loading: false,
          error: null,
          creditError: null,
          ideas: [],

        },
      },
    });
  });

  it('renders competitor analysis and allows force refresh', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        competitorAnalysis: {
          summary: 'Refreshed competitive summary',
          competitors: [
            {
              name: 'UpdatedCompetitor',
              description: 'Updated desc',
              swot: {
                strengths: ['Speed'],
                weaknesses: ['Cost'],
                opportunities: ['Cloud'],
                threats: ['Regulation'],
              },
            },
          ],
        },
      },
    });

    renderWithProviders(<IdeaCompetitors />, {
      routePath: '/idea/:id/competitors',
      initialEntries: ['/idea/idea-456/competitors'],
      preloadedState: {
        auth: {
          token: 'auth-jwt',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
        idea: {
          currentIdea: mockIdeaWithCompetitors as any,
          loading: false,
          error: null,
          creditError: null,
          ideas: [],

        },
      },
    });

    expect(screen.getByText('Competitor Analysis')).toBeInTheDocument();
    expect(screen.getByText('LegacyCorp')).toBeInTheDocument();
    expect(screen.getByText('Brand loyalty')).toBeInTheDocument();
    expect(screen.getByText('Outdated UI')).toBeInTheDocument();
    expect(screen.getByText('Modernization')).toBeInTheDocument();
    expect(screen.getByText('New modern startups')).toBeInTheDocument();

    const refreshBtn = screen.getByRole('button', { name: /regenerate analysis/i });
    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/competitors/analyze/idea-456',
      { forceRefresh: true },
      { headers: { Authorization: 'Bearer auth-jwt' } }
    );

    await waitFor(() => {
      expect(screen.getByText('UpdatedCompetitor')).toBeInTheDocument();
    });
  });

  it('automatically triggers competitor analysis when idea has no competitor analysis yet', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        competitorAnalysis: mockCompetitorData,
      },
    });

    const ideaWithoutCompetitors = {
      ...mockIdeaWithCompetitors,
      competitorAnalysis: undefined,
    };

    renderWithProviders(<IdeaCompetitors />, {
      routePath: '/idea/:id/competitors',
      initialEntries: ['/idea/idea-456/competitors'],
      preloadedState: {
        auth: {
          token: 'auth-jwt',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
        idea: {
          currentIdea: ideaWithoutCompetitors as any,
          loading: false,
          error: null,
          creditError: null,
          ideas: [],

        },
      },
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/api/competitors/analyze/idea-456',
        { forceRefresh: false },
        { headers: { Authorization: 'Bearer auth-jwt' } }
      );
    });
  });
});
