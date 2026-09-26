import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import History from '@/features/dashboard/pages/History';
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

describe('History component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockActivities = [
    {
      _id: 'act-1',
      userId: 'user-1',
      title: 'Idea Validation - Healthcare App',
      description: 'Validated market opportunity',
      creditsUsed: 1,
      createdAt: '2026-03-01T12:00:00.000Z',
      serviceType: 'idea_validation',
      __v: 0,
      data: {
        ideaText: 'Telemedicine platform for seniors',
        scores: { marketDemand: 90, competition: 80, monetization: 85, overall: 85 },
        analysis: {
          marketDemand: { score: 90, text: 'Great' },
          competition: { score: 80, text: 'Medium' },
          monetization: { score: 85, text: 'High' },
          overall: { score: 85, text: 'Strong' },
        },
      },
    },
  ];

  it('renders filter pills and activity history items', () => {
    renderWithProviders(<History />, {
      preloadedState: {
        auth: { token: 'jwt', user: { _id: '1' } },
        history: {
          history: mockActivities,
          loading: false,
          error: null,
          fetchedOnce: true,
        },
      } as any,
    });

    expect(screen.getByText('All Activities')).toBeInTheDocument();
    expect(screen.getByText('Idea Validation - Healthcare App')).toBeInTheDocument();
    expect(screen.getByText('1 Credit')).toBeInTheDocument();
  });

  it('opens activity details modal when View Details is clicked', () => {
    renderWithProviders(<History />, {
      preloadedState: {
        auth: { token: 'jwt', user: { _id: '1' } },
        history: {
          history: mockActivities,
          loading: false,
          error: null,
          fetchedOnce: true,
        },
      } as any,
    });

    const viewDetailsBtn = screen.getByRole('button', { name: /View Details/i });
    fireEvent.click(viewDetailsBtn);

    expect(screen.getByText('Idea Overview')).toBeInTheDocument();
    expect(screen.getByText('Telemedicine platform for seniors')).toBeInTheDocument();
    expect(screen.getByText('90/100')).toBeInTheDocument();
  });

  it('renders empty state when there are no activities', () => {
    renderWithProviders(<History />, {
      preloadedState: {
        auth: { token: 'jwt', user: { _id: '1' } },
        history: {
          history: [],
          loading: false,
          error: null,
          fetchedOnce: true,
        },
      } as any,
    });

    expect(screen.getByText('No Activity Found')).toBeInTheDocument();
  });
});
