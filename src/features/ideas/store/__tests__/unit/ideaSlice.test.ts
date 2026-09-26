import { describe, it, expect, beforeEach, vi } from 'vitest';
import ideaReducer, {
  clearCurrentIdea,
  clearError,
  submitIdea,
  getIdea,
  getSavedIdeas,
  deleteIdea,
  generatePitchDeck,
  generateCanvas,
} from '@/features/ideas/store/ideaSlice';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ideaSlice reducer & async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initialState = {
    ideas: [],
    currentIdea: null,
    loading: false,
    error: null,
    creditError: null,
  };

  const sampleIdea = {
    _id: 'idea-1',
    ideaText: 'AI automated pitch generator',
    marketDemandScore: 85,
    competitionScore: 70,
    monetizationFeasibilityScore: 90,
    overallScore: 82,
    createdAt: '2026-09-26T12:00:00Z',
    analysis: {
      marketDemand: { score: 85, text: 'Strong demand' },
      competition: { score: 70, text: 'Moderate competition' },
      monetization: { score: 90, text: 'Clear B2B SaaS tiers' },
      overall: { score: 82, text: 'High potential startup' },
    },
  };

  it('handles clearCurrentIdea action', () => {
    const state = { ...initialState, currentIdea: sampleIdea };
    const nextState = ideaReducer(state, clearCurrentIdea());
    expect(nextState.currentIdea).toBeNull();
  });

  it('handles clearError action', () => {
    const state = {
      ...initialState,
      error: 'Some failure',
      creditError: { show: true, creditsRequired: 1, creditsAvailable: 0 },
    };
    const nextState = ideaReducer(state, clearError());
    expect(nextState.error).toBeNull();
    expect(nextState.creditError).toBeNull();
  });

  describe('submitIdea thunk', () => {
    it('successfully submits idea and updates currentIdea and credits', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const responseData = { ...sampleIdea, userCredits: 4 };
      (api.post as any).mockResolvedValueOnce({ data: responseData });

      const result = await submitIdea({ ideaText: 'AI automated pitch generator' })(
        dispatch,
        getState,
        undefined
      );

      expect(api.post).toHaveBeenCalledWith('/api/idea/submit', {
        ideaText: 'AI automated pitch generator',
      });
      expect(result.type).toBe('idea/submit/fulfilled');

      const nextState = ideaReducer(initialState, {
        type: submitIdea.fulfilled.type,
        payload: responseData,
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.currentIdea).toEqual(responseData);
    });

    it('handles 402 insufficient credits error in submitIdea', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce({
        response: {
          status: 402,
          data: {
            message: 'Insufficient credits to submit idea',
            creditsRequired: 1,
            creditsAvailable: 0,
          },
        },
      });

      const result = await submitIdea({ ideaText: 'Idea text' })(dispatch, getState, undefined);

      expect(result.type).toBe('idea/submit/rejected');

      const nextState = ideaReducer(initialState, {
        type: submitIdea.rejected.type,
        payload: result.payload,
      });

      expect(nextState.loading).toBe(false);
      expect(nextState.creditError).toEqual({
        show: true,
        creditsRequired: 1,
        creditsAvailable: 0,
      });
    });

    it('handles generic error in submitIdea', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce(new Error('Server error'));

      const result = await submitIdea({ ideaText: 'Idea text' })(dispatch, getState, undefined);
      expect(result.type).toBe('idea/submit/rejected');

      const nextState = ideaReducer(initialState, {
        type: submitIdea.rejected.type,
        payload: result.payload,
      });
      expect(nextState.error).toBe('Server error');
    });
  });

  describe('getIdea thunk', () => {
    it('fetches idea by ID successfully', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockResolvedValueOnce({ data: sampleIdea });

      const result = await getIdea('idea-1')(dispatch, getState, undefined);
      expect(api.get).toHaveBeenCalledWith('/api/idea/idea-1');
      expect(result.type).toBe(getIdea.fulfilled.type);

      const nextState = ideaReducer(initialState, {
        type: getIdea.fulfilled.type,
        payload: sampleIdea,
      });
      expect(nextState.currentIdea).toEqual(sampleIdea);
    });

    it('handles getIdea rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockRejectedValueOnce(new Error('Idea not found'));

      const result = await getIdea('non-existent')(dispatch, getState, undefined);
      expect(result.type).toBe(getIdea.rejected.type);

      const nextState = ideaReducer(initialState, {
        type: getIdea.rejected.type,
        payload: result.payload,
      });
      expect(nextState.error).toBe('Idea not found');
    });
  });

  describe('getSavedIdeas thunk', () => {
    it('fetches list of saved ideas', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockResolvedValueOnce({ data: { ideas: [sampleIdea] } });

      const result = await getSavedIdeas()(dispatch, getState, undefined);
      expect(api.get).toHaveBeenCalledWith('/api/idea/saved');
      expect(result.type).toBe(getSavedIdeas.fulfilled.type);

      const nextState = ideaReducer(initialState, {
        type: getSavedIdeas.fulfilled.type,
        payload: [sampleIdea],
      });
      expect(nextState.ideas).toEqual([sampleIdea]);
    });

    it('handles getSavedIdeas rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockRejectedValueOnce(new Error('Failed to load'));

      const result = await getSavedIdeas()(dispatch, getState, undefined);
      expect(result.type).toBe(getSavedIdeas.rejected.type);
    });
  });

  describe('deleteIdea thunk', () => {
    it('deletes idea and removes it from state list and currentIdea', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.delete as any).mockResolvedValueOnce({});

      const result = await deleteIdea('idea-1')(dispatch, getState, undefined);
      expect(api.delete).toHaveBeenCalledWith('/api/idea/idea-1');
      expect(result.type).toBe(deleteIdea.fulfilled.type);

      const stateWithIdea = {
        ...initialState,
        ideas: [sampleIdea],
        currentIdea: sampleIdea,
      };

      const nextState = ideaReducer(stateWithIdea, {
        type: deleteIdea.fulfilled.type,
        payload: 'idea-1',
      });
      expect(nextState.ideas).toHaveLength(0);
      expect(nextState.currentIdea).toBeNull();
    });

    it('handles deleteIdea rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.delete as any).mockRejectedValueOnce(new Error('Delete forbidden'));

      const result = await deleteIdea('idea-1')(dispatch, getState, undefined);
      expect(result.type).toBe(deleteIdea.rejected.type);
    });
  });

  describe('generatePitchDeck thunk', () => {
    it('generates pitch deck, updates currentIdea and decrements credits', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: 'token', user: { credits: 5 } },
      }));
      const updatedIdea = {
        ...sampleIdea,
        pitchDeckContent: { problem: 'Big problem', solution: 'Great solution' },
      };
      (api.post as any).mockResolvedValueOnce({ data: updatedIdea });

      const result = await generatePitchDeck('idea-1')(dispatch, getState, undefined);

      expect(api.post).toHaveBeenCalledWith('/api/pitchdeck/idea-1', {});
      expect(dispatch).toHaveBeenCalled();
      expect(result.type).toBe('idea/generatePitchDeck/fulfilled');

      const nextState = ideaReducer(initialState, {
        type: generatePitchDeck.fulfilled.type,
        payload: updatedIdea,
      });
      expect(nextState.currentIdea).toEqual(updatedIdea);
    });

    it('handles 402 insufficient credits in generatePitchDeck', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: 'token', user: { credits: 0 } },
      }));
      (api.post as any).mockRejectedValueOnce({
        response: {
          status: 402,
          data: { message: 'Out of credits', creditsRequired: 1, creditsAvailable: 0 },
        },
      });

      const result = await generatePitchDeck('idea-1')(dispatch, getState, undefined);
      expect(result.type).toBe('idea/generatePitchDeck/rejected');

      const nextState = ideaReducer(initialState, {
        type: generatePitchDeck.rejected.type,
        payload: result.payload,
      });
      expect(nextState.creditError?.show).toBe(true);
    });
  });

  describe('generateCanvas thunk', () => {
    it('generates canvas, updates currentIdea and decrements credits', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: 'token', user: { credits: 5 } },
      }));
      const updatedIdea = {
        ...sampleIdea,
        canvasContent: { problem: 'Problem canvas', solution: 'Solution canvas' },
      };
      (api.post as any).mockResolvedValueOnce({ data: updatedIdea });

      const result = await generateCanvas('idea-1')(dispatch, getState, undefined);

      expect(api.post).toHaveBeenCalledWith('/api/canvas/idea-1', {});
      expect(result.type).toBe('idea/generateCanvas/fulfilled');

      const nextState = ideaReducer(initialState, {
        type: generateCanvas.fulfilled.type,
        payload: updatedIdea,
      });
      expect(nextState.currentIdea).toEqual(updatedIdea);
    });

    it('handles 402 insufficient credits in generateCanvas', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        auth: { token: 'token', user: { credits: 0 } },
      }));
      (api.post as any).mockRejectedValueOnce({
        response: {
          status: 402,
          data: { message: 'Need 1 credit', creditsRequired: 1, creditsAvailable: 0 },
        },
      });

      const result = await generateCanvas('idea-1')(dispatch, getState, undefined);
      expect(result.type).toBe('idea/generateCanvas/rejected');

      const nextState = ideaReducer(initialState, {
        type: generateCanvas.rejected.type,
        payload: result.payload,
      });
      expect(nextState.creditError?.show).toBe(true);
    });
  });
});
