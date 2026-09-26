import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import PitchSimulator from '../../pages/PitchSimulator';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
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

describe('PitchSimulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockQuestions = [
    {
      id: 'q1',
      question: 'How do you plan to acquire your first 1,000 customers?',
      category: 'Marketing',
    },
    {
      id: 'q2',
      question: 'What is your defensible moat against copycats?',
      category: 'Defensibility',
    },
  ];

  it('renders initial pitch input form with submit button disabled when empty', () => {
    renderWithProviders(<PitchSimulator />, {
      preloadedState: {
        auth: {
          token: 'token-123',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText('Pitch Simulator')).toBeInTheDocument();
    expect(screen.getByText(/Practice your pitch with AI-powered investor Q&A/i)).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/describe your startup pitch/i);
    expect(textarea).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: /start simulation/i });
    expect(startBtn).toBeDisabled();
  });

  it('submits pitch, shows Ready to Start and begins Q&A session', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { questions: mockQuestions },
    });

    renderWithProviders(<PitchSimulator />, {
      preloadedState: {
        auth: {
          token: 'token-123',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const textarea = screen.getByPlaceholderText(/describe your startup pitch/i);
    fireEvent.change(textarea, { target: { value: 'We are building an AI tool for pitch decks' } });

    const startBtn = screen.getByRole('button', { name: /start simulation/i });
    expect(startBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(startBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/pitch-simulator/simulate',
      { pitch: 'We are building an AI tool for pitch decks' },
      { headers: { Authorization: 'Bearer token-123' } }
    );

    await waitFor(() => {
      expect(screen.getByText('Ready to Start?')).toBeInTheDocument();
      expect(screen.getByText(/2 investor questions generated/i)).toBeInTheDocument();
    });

    const startQaBtn = screen.getByRole('button', { name: /start q&a session/i });
    fireEvent.click(startQaBtn);

    expect(screen.getByText('How do you plan to acquire your first 1,000 customers?')).toBeInTheDocument();
  });

  it('allows answering a question, submitting answer, and receiving feedback evaluation', async () => {
    vi.mocked(api.post)
      .mockResolvedValueOnce({
        data: { questions: mockQuestions },
      })
      .mockResolvedValueOnce({
        data: {
          feedback: {
            rating: 8.5,
            strengths: ['Clear CAC breakdown', 'High referral organic loop'],
            improvements: ['Need clearer unit economics'],
            additionalAdvice: 'Consider enterprise pilot contracts before scaling B2C.',
          },
        },
      });

    renderWithProviders(<PitchSimulator />, {
      preloadedState: {
        auth: {
          token: 'token-123',
          user: null,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const pitchTextarea = screen.getByPlaceholderText(/describe your startup pitch/i);
    fireEvent.change(pitchTextarea, { target: { value: 'AI pitch helper' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start simulation/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Ready to Start?')).toBeInTheDocument();
    });

    // Start Q&A session
    const startQaBtn = screen.getByRole('button', { name: /start q&a session/i });
    await act(async () => {
      fireEvent.click(startQaBtn);
    });

    expect(screen.getByText('How do you plan to acquire your first 1,000 customers?')).toBeInTheDocument();

    // Answer textarea
    const answerTextarea = screen.getByPlaceholderText(/type your response/i);
    fireEvent.change(answerTextarea, { target: { value: 'We will use organic developer communities and product-led growth.' } });

    const submitAnswerBtn = screen.getByRole('button', { name: /submit answer/i });
    await act(async () => {
      fireEvent.click(submitAnswerBtn);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/api/pitch-simulator/evaluate',
      {
        pitch: 'AI pitch helper',
        question: 'How do you plan to acquire your first 1,000 customers?',
        answer: 'We will use organic developer communities and product-led growth.',
      },
      { headers: { Authorization: 'Bearer token-123' } }
    );

    await waitFor(() => {
      expect(screen.getByText(/Score:/i)).toBeInTheDocument();
      expect(screen.getByText('Clear CAC breakdown')).toBeInTheDocument();
      expect(screen.getByText('Need clearer unit economics')).toBeInTheDocument();
      expect(screen.getByText('Consider enterprise pilot contracts before scaling B2C.')).toBeInTheDocument();
    });
  });

  it('displays InsufficientCreditsModal on 402 error', async () => {
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        status: 402,
        data: {
          creditsRequired: 1,
          creditsAvailable: 0,
        },
      },
    });

    renderWithProviders(<PitchSimulator />);

    const textarea = screen.getByPlaceholderText(/describe your startup pitch/i);
    fireEvent.change(textarea, { target: { value: 'Valid pitch but zero credits' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start simulation/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Insufficient Credits')).toBeInTheDocument();
    });

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Insufficient Credits')).not.toBeInTheDocument();
  });

  it('regression: safely handles response missing questions array without crashing', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {}, // no questions array provided
    });

    renderWithProviders(<PitchSimulator />);

    const textarea = screen.getByPlaceholderText(/describe your startup pitch/i);
    fireEvent.change(textarea, { target: { value: 'Testing empty questions fallback' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start simulation/i }));
    });

    // Does not throw unhandled TypeError, remains on form
    expect(screen.getByText('Pitch Simulator')).toBeInTheDocument();
  });
});
