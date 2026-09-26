import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '@/features/dashboard/pages/Dashboard';
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

describe('Dashboard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPreloadedState = {
    auth: {
      user: {
        _id: 'user-123',
        name: 'Alex Founder',
        email: 'alex@founder.io',
        credits: 15,
        isPremium: false,
      },
      token: 'jwt-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    },
    idea: {
      ideas: [
        {
          _id: 'idea-1',
          ideaText: 'SaaS Customer Retention Platform',
          overallScore: 84,
          marketDemandScore: 90,
          competitionScore: 80,
          monetizationFeasibilityScore: 85,
          createdAt: '2026-03-01T10:00:00.000Z',
          pitchDeckContent: { slides: [] },
          analysis: {
            marketDemand: { score: 90, text: 'Strong' },
            competition: { score: 80, text: 'Medium' },
            monetization: { score: 85, text: 'High' },
            overall: { score: 84, text: 'Great' },
          },
        },
      ],
      currentIdea: null,
      loading: false,
      error: null,
      creditError: null,
    },
  };

  it('renders welcome greeting and stats cards', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: mockPreloadedState as any,
    });

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Alex Founder/i)).toBeInTheDocument();
    expect(screen.getByText('Total Ideas')).toBeInTheDocument();
    expect(screen.getByText('Pitch Decks')).toBeInTheDocument();
    expect(screen.getByText('Average Score')).toBeInTheDocument();
  });

  it('renders quick action cards for navigation', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: mockPreloadedState as any,
    });

    expect(screen.getByText('Submit New Idea')).toBeInTheDocument();
    expect(screen.getByText('View Saved Ideas')).toBeInTheDocument();
  });

  it('renders recent ideas section with idea title and score', () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: mockPreloadedState as any,
    });

    expect(screen.getByText('Recent Ideas')).toBeInTheDocument();
    expect(screen.getByText('SaaS Customer Retention Platform')).toBeInTheDocument();
    expect(screen.getAllByText('84%').length).toBeGreaterThanOrEqual(1);
  });
});
