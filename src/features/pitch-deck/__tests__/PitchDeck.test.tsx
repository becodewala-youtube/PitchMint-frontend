import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PitchDeck from '@/features/pitch-deck/pages/PitchDeck';
import { renderWithProviders } from '../../../../tests/setup/test-utils';
import * as pdfUtils from '@/shared/utils/pdfExport';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('PitchDeck page component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIdeaWithDeck = {
    _id: 'deck-123',
    ideaText: 'AI Powered Pitch Deck Creator',
    overallScore: 90,
    marketDemandScore: 92,
    competitionScore: 85,
    monetizationFeasibilityScore: 90,
    createdAt: '2026-03-01T10:00:00.000Z',
    pitchDeckContent: {
      problem: 'Creating pitch decks takes weeks.',
      solution: 'PitchMint generates slides in seconds.',
    },
    analysis: {
      marketDemand: { score: 92, text: 'Strong demand' },
      competition: { score: 85, text: 'Medium competition' },
      monetization: { score: 90, text: 'Good monetization' },
      overall: { score: 90, text: 'Excellent' },
    },
  };

  it('renders pitch deck slide title, content, and thumbnails', () => {
    renderWithProviders(<PitchDeck />, {
      route: '/pitch-deck/deck-123',
      routePath: '/pitch-deck/:id',
      preloadedState: {
        idea: {
          ideas: [mockIdeaWithDeck],
          currentIdea: mockIdeaWithDeck,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    expect(screen.getAllByText('Problem')[0]).toBeInTheDocument();
    expect(screen.getByText('Creating pitch decks takes weeks.')).toBeInTheDocument();
    expect(screen.getByText('All Slides')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
  });

  it('navigates through slides with Next and Prev buttons', () => {
    renderWithProviders(<PitchDeck />, {
      route: '/pitch-deck/deck-123',
      routePath: '/pitch-deck/:id',
      preloadedState: {
        idea: {
          ideas: [mockIdeaWithDeck],
          currentIdea: mockIdeaWithDeck,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    const nextBtn = screen.getByRole('button', { name: /Next Slide/i });
    fireEvent.click(nextBtn);

    expect(screen.getAllByText('Solution')[0]).toBeInTheDocument();
    expect(screen.getByText('PitchMint generates slides in seconds.')).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /Previous Slide/i });
    fireEvent.click(prevBtn);

    expect(screen.getAllByText('Problem')[0]).toBeInTheDocument();
  });

  it('calls exportAllSlidesToPDF when Export PDF button is clicked', async () => {
    const exportSpy = vi.spyOn(pdfUtils, 'exportAllSlidesToPDF').mockResolvedValue(undefined);

    renderWithProviders(<PitchDeck />, {
      route: '/pitch-deck/deck-123',
      routePath: '/pitch-deck/:id',
      preloadedState: {
        idea: {
          ideas: [mockIdeaWithDeck],
          currentIdea: mockIdeaWithDeck,
          loading: false,
          error: null,
          creditError: null,
        },
      } as any,
    });

    const exportBtn = screen.getByRole('button', { name: /Export PDF/i });
    fireEvent.click(exportBtn);

    expect(exportSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Problem', content: 'Creating pitch decks takes weeks.' }),
        expect.objectContaining({ title: 'Solution', content: 'PitchMint generates slides in seconds.' }),
      ]),
      'pitch-deck-deck-123'
    );
  });
});
