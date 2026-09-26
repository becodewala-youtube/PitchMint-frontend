import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../tests/setup/test-utils';
import userEvent from '@testing-library/user-event';
import { server } from '../../../../../tests/setup/msw/server';
import { http, HttpResponse } from 'msw';
import { Routes, Route } from 'react-router-dom';
import PitchDeck from '@/features/pitch-deck/pages/PitchDeck';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PitchDeck Integration', () => {
  const mockInitialState = {
    auth: {
      user: { _id: 'user123', name: 'Test User', email: 'test@example.com', credits: 10, isPremium: false },
      token: 'mock-jwt',
      isAuthenticated: true,
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('loads existing pitch deck', async () => {
    server.use(
      http.get('*/api/idea/:id', ({ params }) => {
        console.log('MSW intercepted GET /api/idea/:id with params:', params);
        return HttpResponse.json({
          _id: params.id,
          ideaText: 'Test Idea',
          pitchDeckContent: {
            problem: 'A very big problem',
            solution: 'A very good solution',
          },
          createdAt: new Date().toISOString(),
        });
      })
    );

    renderWithProviders(
      <Routes>
        <Route path="/pitch-deck/:id" element={<PitchDeck />} />
      </Routes>, 
      { 
        route: '/pitch-deck/idea-123',
        preloadedState: mockInitialState 
      }
    );

    const problems = await screen.findAllByText(/Problem/i, {}, { timeout: 4000 });
    expect(problems.length).toBeGreaterThan(0);
    expect(await screen.findByText(/A very big problem/i, {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('generates pitch deck if none exists', async () => {
    // initial fetch returns idea without pitch deck
    server.use(
      http.get('*/api/idea/:id', ({ params }) => {
        return HttpResponse.json({
          _id: params.id,
          ideaText: 'Test Idea without pitch deck',
          createdAt: new Date().toISOString(),
        });
      })
    );

    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/pitch-deck/:id" element={<PitchDeck />} />
      </Routes>, 
      { 
        route: '/pitch-deck/idea-123',
        preloadedState: mockInitialState 
      }
    );

    // PitchDeck component automatically generates if none exists
    // Wait for the generated content to appear (from our mock handler)
    expect(await screen.findByText(/Test problem/i, {}, { timeout: 4000 })).toBeInTheDocument();
  });
});
