import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import Canvas from '../../pages/Canvas';
import CanvasSkeleton from '../../components/CanvasSkeleton';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import * as ideaSlice from '@/features/ideas/store/ideaSlice';

// ─── Mock API so no real HTTP calls happen ────────────────────────────────────
vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

// ─── A no-op thunk that resolves immediately, preventing infinite re-renders ──
const makeNoopThunk = () => (_dispatch: unknown) => Promise.resolve({ type: 'noop' });

const baseIdeaState = {
  currentIdea: null as any,
  savedIdeas: [] as any[],
  ideas: [] as any[],
  loading: false,
  error: null as string | null,
  creditError: null as any,

};

const mockIdeaWithCanvas = {
  _id: 'idea-123',
  title: 'Fintech App',
  ideaText: 'An AI-powered personal finance assistant',
  overallScore: 85,
  marketDemandScore: 90,
  competitionScore: 80,
  monetizationFeasibilityScore: 85,
  analysis: {
    marketDemand: { score: 90, text: 'Strong' },
    competition: { score: 80, text: 'Medium' },
    monetization: { score: 85, text: 'High' },
    overall: { score: 85, text: 'Great' },
  },
  canvasContent: {
    problem: 'High fees and poor UX in traditional banking',
    customerSegments: 'Tech-savvy millennials and Gen Z',
    solution: 'Automated budgeting with zero hidden fees',
    uniqueValueProposition: 'AI-first personal CFO in your pocket',
    keyMetrics: 'Monthly active users, savings rate',
    channels: 'Social media ads, viral referrals',
    costStructure: 'Cloud hosting, regulatory compliance',
    revenueStreams: 'Freemium subscriptions, interchange',
    unfairAdvantage: 'Proprietary financial prediction engine',
  },
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

describe('Canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Make both thunks no-ops so useEffect never loops
    vi.spyOn(ideaSlice, 'generateCanvas').mockReturnValue(makeNoopThunk() as any);
    vi.spyOn(ideaSlice, 'getIdea').mockReturnValue(makeNoopThunk() as any);
  });

  // ── CanvasSkeleton ──────────────────────────────────────────────────────────
  it('renders CanvasSkeleton component properly', () => {
    const { container } = renderWithProviders(<CanvasSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  // ── Loading state ───────────────────────────────────────────────────────────
  it('renders loading skeletons when loading is true', () => {
    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: { ...baseIdeaState, loading: true },
      },
    });
    expect(screen.queryByText('Business Model Canvas')).not.toBeInTheDocument();
  });

  // ── Error state ─────────────────────────────────────────────────────────────
  it('renders error state when error is present', () => {
    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: {
          ...baseIdeaState,
          currentIdea: { _id: 'idea-123', canvasContent: { problem: 'sample' } } as any,
          error: 'Failed to fetch business canvas',
        },
      },
    });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch business canvas')).toBeInTheDocument();
  });

  // ── Null idea ───────────────────────────────────────────────────────────────
  it('returns null if idea is not loaded and not loading', () => {
    const { container } = renderWithProviders(<Canvas />, {
      routePath: '/canvas',
      initialEntries: ['/canvas'],
      preloadedState: {
        idea: { ...baseIdeaState },
      },
    });
    expect(container.firstChild).toBeNull();
  });

  // ── Full canvas render ──────────────────────────────────────────────────────
  it('renders the 9 canvas sections when canvasContent exists', () => {
    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: { ...baseIdeaState, currentIdea: mockIdeaWithCanvas },
      },
    });

    expect(screen.getByText('Business Model Canvas')).toBeInTheDocument();
    expect(screen.getByText('Lean startup methodology visualization')).toBeInTheDocument();

    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByText('High fees and poor UX in traditional banking')).toBeInTheDocument();
    expect(screen.getByText('Customer Segments')).toBeInTheDocument();
    expect(screen.getByText('Tech-savvy millennials and Gen Z')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Automated budgeting with zero hidden fees')).toBeInTheDocument();
    expect(screen.getByText('Unique Value Proposition')).toBeInTheDocument();
    expect(screen.getByText('AI-first personal CFO in your pocket')).toBeInTheDocument();
    expect(screen.getByText('Key Metrics')).toBeInTheDocument();
    expect(screen.getByText('Monthly active users, savings rate')).toBeInTheDocument();
    expect(screen.getByText('Channels')).toBeInTheDocument();
    expect(screen.getByText('Social media ads, viral referrals')).toBeInTheDocument();
    expect(screen.getByText('Cost Structure')).toBeInTheDocument();
    expect(screen.getByText('Cloud hosting, regulatory compliance')).toBeInTheDocument();
    expect(screen.getByText('Revenue Streams')).toBeInTheDocument();
    expect(screen.getByText('Freemium subscriptions, interchange')).toBeInTheDocument();
    expect(screen.getByText('Unfair Advantage')).toBeInTheDocument();
    expect(screen.getByText('Proprietary financial prediction engine')).toBeInTheDocument();
  });

  // ── Auto-generate when canvas is missing ────────────────────────────────────
  it('triggers auto-generation when idea exists but canvasContent is missing', async () => {
    const generateCanvasSpy = vi.spyOn(ideaSlice, 'generateCanvas').mockReturnValue(makeNoopThunk() as any);
    const ideaWithoutCanvas = { ...mockIdeaWithCanvas, canvasContent: undefined };

    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: { ...baseIdeaState, currentIdea: ideaWithoutCanvas },
      },
    });

    await waitFor(() => {
      expect(generateCanvasSpy).toHaveBeenCalledWith('idea-123');
    });
  });

  // ── Regenerate button ───────────────────────────────────────────────────────
  it('triggers regenerate when user clicks the Regenerate button', async () => {
    const generateCanvasSpy = vi.spyOn(ideaSlice, 'generateCanvas').mockReturnValue(makeNoopThunk() as any);

    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: { ...baseIdeaState, currentIdea: mockIdeaWithCanvas },
      },
    });

    const regenerateBtn = screen.getByRole('button', { name: /regenerate/i });
    await act(async () => {
      fireEvent.click(regenerateBtn);
    });

    expect(generateCanvasSpy).toHaveBeenCalledWith('idea-123');
  });

  // ── InsufficientCreditsModal ────────────────────────────────────────────────
  it('shows InsufficientCreditsModal when creditError.show is true', () => {
    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: {
          ...baseIdeaState,
          currentIdea: mockIdeaWithCanvas,
          creditError: { show: true, creditsRequired: 1, creditsAvailable: 0 },
        },
      },
    });
    expect(screen.getByText('Insufficient Credits')).toBeInTheDocument();
  });

  it('dispatches clearError when cancel is clicked in InsufficientCreditsModal', () => {
    const clearErrorSpy = vi.spyOn(ideaSlice, 'clearError');

    renderWithProviders(<Canvas />, {
      routePath: '/canvas/:id',
      initialEntries: ['/canvas/idea-123'],
      preloadedState: {
        idea: {
          ...baseIdeaState,
          currentIdea: mockIdeaWithCanvas,
          creditError: { show: true, creditsRequired: 1, creditsAvailable: 0 },
        },
      },
    });

    expect(screen.getByText('Insufficient Credits')).toBeInTheDocument();
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(clearErrorSpy).toHaveBeenCalled();
  });
});
