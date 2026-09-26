import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import IdeaPitchSimulator from '../pages/IdeaPitchSimulator';
import ArenaSkeleton from '../components/ArenaSkeleton';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
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

describe('IdeaPitchSimulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ideaSlice, 'getIdea').mockReturnValue({
      type: 'idea/getIdea/fulfilled',
      payload: {},
      unwrap: () => Promise.resolve({}),
    } as any);
  });

  const mockQuestions = [
    {
      id: 'q1',
      question: 'How do you prevent churn in month 3?',
      category: 'Retention',
      answer: 'By offering sticky workflows.',
      feedback: {
        rating: 9,
        strengths: ['Great retention focus'],
        improvements: ['Include cohorts'],
        additionalAdvice: 'Benchmark against SaaS averages.',
      },
    },
    {
      id: 'q2',
      question: 'What is your pricing strategy?',
      category: 'Monetization',
    },
  ];

  const mockIdeaWithSimulation = {
    _id: 'idea-sim-1',
    title: 'Fintech Bot',
    description: 'Autonomous financial bookkeeping',
    ideaText: 'Autonomous financial bookkeeping for SMBs',
    pitchSimulation: {
      questions: mockQuestions,
    },
  };

  it('renders ArenaSkeleton properly', () => {
    const { container } = renderWithProviders(<ArenaSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders ArenaSkeleton when loading is true', () => {
    renderWithProviders(<IdeaPitchSimulator />, {
      routePath: '/idea/:id/pitch-simulator',
      initialEntries: ['/idea/idea-sim-1/pitch-simulator'],
      preloadedState: {
        idea: {
          currentIdea: null,
          savedIdeas: [],
          loading: true,
          error: null,
          creditError: null,
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      },
    });

    expect(screen.queryByText('Pitch Simulator')).not.toBeInTheDocument();
  });

  it('renders question, answer, and feedback when pitchSimulation exists on idea', () => {
    renderWithProviders(<IdeaPitchSimulator />, {
      routePath: '/idea/:id/pitch-simulator',
      initialEntries: ['/idea/idea-sim-1/pitch-simulator'],
      preloadedState: {
        auth: {
          token: 'auth-token',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
          verificationSent: false,
        },
        idea: {
          currentIdea: mockIdeaWithSimulation as any,
          savedIdeas: [],
          loading: false,
          error: null,
          creditError: null,
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      },
    });

    expect(screen.getByText('Pitch Simulator')).toBeInTheDocument();
    expect(screen.getByText('How do you prevent churn in month 3?')).toBeInTheDocument();
    expect(screen.getByText('Great retention focus')).toBeInTheDocument();
    expect(screen.getByText('Include cohorts')).toBeInTheDocument();
    expect(screen.getByText('Benchmark against SaaS averages.')).toBeInTheDocument();
  });

  it('allows regenerating questions when regenerate button is clicked', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        pitchSimulation: {
          questions: [
            {
              id: 'q-new',
              question: 'Brand new simulated question?',
              category: 'Strategy',
            },
          ],
        },
      },
    });

    renderWithProviders(<IdeaPitchSimulator />, {
      routePath: '/idea/:id/pitch-simulator',
      initialEntries: ['/idea/idea-sim-1/pitch-simulator'],
      preloadedState: {
        auth: {
          token: 'auth-token',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
          verificationSent: false,
        },
        idea: {
          currentIdea: mockIdeaWithSimulation as any,
          savedIdeas: [],
          loading: false,
          error: null,
          creditError: null,
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      },
    });

    const regenerateBtn = screen.getByRole('button', { name: /regenerate questions/i });
    await act(async () => {
      fireEvent.click(regenerateBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/pitch-simulator/simulate/idea-sim-1',
      {},
      {
        headers: { Authorization: 'Bearer auth-token' },
        params: { regenerate: true },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Brand new simulated question?')).toBeInTheDocument();
    });
  });
});
