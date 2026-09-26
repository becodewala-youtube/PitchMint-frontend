import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubmitIdea from '@/features/ideas/pages/SubmitIdea';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';

vi.mock('@/shared/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe('SubmitIdea Page', () => {
  it('renders submit idea form and elements', () => {
    renderWithProviders(<SubmitIdea />, {
      preloadedState: {
        auth: {
          user: { _id: '1', name: 'Test User', email: 'test@example.com', isPremium: false, credits: 5 },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText(/Submit Your/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/describe your startup idea/i)).toBeInTheDocument();
    expect(screen.getByText('Analyze Idea (1 Credit)')).toBeInTheDocument();
  });

  it('enables submit button only when idea text is entered', () => {
    renderWithProviders(<SubmitIdea />, {
      preloadedState: {
        auth: {
          user: { _id: '1', name: 'Test', email: 'test@example.com', isPremium: false, credits: 5 },
          token: 'token',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const textarea = screen.getByLabelText(/describe your startup idea/i);
    const submitButton = screen.getByRole('button', { name: /analyze idea/i });

    expect(submitButton).toBeDisabled();

    fireEvent.change(textarea, { target: { value: 'A platform connecting dog owners with local sitters' } });
    expect(submitButton).toBeEnabled();
  });

  it('displays insufficient credits modal when creditError is set', () => {
    renderWithProviders(<SubmitIdea />, {
      preloadedState: {
        idea: {
          ideas: [],
          currentIdea: null,
          loading: false,
          error: null,
          creditError: {
            show: true,
            creditsRequired: 1,
            creditsAvailable: 0,
          },
        },
      },
    });

    expect(screen.getByText(/Insufficient Credits/i)).toBeInTheDocument();
  });
});