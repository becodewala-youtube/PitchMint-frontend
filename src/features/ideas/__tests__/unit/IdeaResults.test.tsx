import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IdeaResults from '@/features/ideas/pages/IdeaResults';
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

describe('IdeaResults component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIdea = {
    _id: 'idea-123',
    ideaText: 'On-demand drone delivery service for medicines',
    overallScore: 92,
    marketDemandScore: 95,
    competitionScore: 85,
    monetizationFeasibilityScore: 90,
    createdAt: '2026-03-01T10:00:00.000Z',
    analysis: {
      marketDemand: { score: 95, text: 'Massive TAM in rural areas' },
      competition: { score: 85, text: 'Few direct drone competitors' },
      monetization: { score: 90, text: 'High subscription willingness' },
      overall: { score: 92, text: 'Exceptional potential for Series A' },
    },
  };

  it('renders idea analysis details, scores, and action buttons', () => {
    renderWithProviders(<IdeaResults />, {
      route: '/idea/idea-123',
      routePath: '/idea/:id',
      preloadedState: {
        idea: {
          ideas: [mockIdea],
          currentIdea: mockIdea,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    expect(screen.getByText('On-demand drone delivery service for medicines')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('Massive TAM in rural areas')).toBeInTheDocument();
    expect(screen.getByText('Few direct drone competitors')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pitch Deck/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Canvas/i })).toBeInTheDocument();
  });

  it('renders error view when state has error', () => {
    renderWithProviders(<IdeaResults />, {
      route: '/idea/idea-error',
      preloadedState: {
        idea: {
          ideas: [],
          currentIdea: null,
          loading: false,
          error: 'Idea analysis could not be loaded',
          creditError: null,
        },
      } as any,
    });

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Idea analysis could not be loaded')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Saved Ideas/i })).toHaveAttribute(
      'href',
      '/saved-ideas'
    );
  });
});
