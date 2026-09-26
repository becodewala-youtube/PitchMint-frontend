import { describe, it, expect, beforeEach, vi } from 'vitest';
import historyReducer, {
  clearHistory,
  fetchUserHistory,
  addHistoryEntry,
  HistoryItem,
} from '@/features/dashboard/store/historySlice';
import api from '@/shared/lib/api';

vi.mock('@/shared/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('historySlice reducer & async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initialState = {
    history: [],
    loading: false,
    error: null,
    fetchedOnce: false,
  };

  const sampleHistoryItem: HistoryItem = {
    _id: 'hist-1',
    userId: 'user-1',
    title: 'Idea Validation: PitchMint',
    description: 'Validation report generated',
    creditsUsed: 1,
    serviceType: 'idea_validation',
    createdAt: '2026-09-26T12:00:00Z',
    __v: 0,
    data: {
      score: 85,
      strengths: ['Innovative'],
      weaknesses: ['Competitors'],
      feedback: 'Good project',
      marketPotential: 'High',
      technicalFeasibility: 'Medium',
      monetizationStrategy: 'Subscriptions',
    },
  };

  it('handles clearHistory action', () => {
    const populatedState = {
      history: [sampleHistoryItem],
      loading: false,
      error: 'Error',
      fetchedOnce: true,
    };

    const nextState = historyReducer(populatedState, clearHistory());
    expect(nextState.history).toHaveLength(0);
    expect(nextState.error).toBeNull();
    expect(nextState.fetchedOnce).toBe(false);
  });

  describe('fetchUserHistory thunk', () => {
    it('fetches user history successfully', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockResolvedValueOnce({ data: [sampleHistoryItem] });

      const result = await fetchUserHistory()(dispatch, getState, undefined);
      expect(api.get).toHaveBeenCalledWith('/api/history');
      expect(result.type).toBe('history/fetchUserHistory/fulfilled');

      const nextState = historyReducer(initialState, {
        type: fetchUserHistory.fulfilled.type,
        payload: [sampleHistoryItem],
      });
      expect(nextState.history).toEqual([sampleHistoryItem]);
      expect(nextState.fetchedOnce).toBe(true);
      expect(nextState.loading).toBe(false);
    });

    it('handles fetchUserHistory rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.get as any).mockRejectedValueOnce(new Error('Failed to load history'));

      const result = await fetchUserHistory()(dispatch, getState, undefined);
      expect(result.type).toBe('history/fetchUserHistory/rejected');

      const nextState = historyReducer(initialState, {
        type: fetchUserHistory.rejected.type,
        payload: 'Failed to load history',
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Failed to load history');
    });
  });

  describe('addHistoryEntry thunk', () => {
    it('adds history entry and prepends to state', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const responseData = { ...sampleHistoryItem, userCredits: 9 };
      (api.post as any).mockResolvedValueOnce({ data: responseData });

      const payload = {
        serviceType: 'idea_validation',
        title: 'New Idea',
        description: 'New Description',
        data: {},
        creditsUsed: 1,
      };

      const result = await addHistoryEntry(payload)(dispatch, getState, undefined);
      expect(result.type).toBe('history/addHistoryEntry/fulfilled');
      expect(dispatch).toHaveBeenCalled();

      const nextState = historyReducer(initialState, {
        type: addHistoryEntry.fulfilled.type,
        payload: responseData,
      });
      expect(nextState.history[0]).toEqual(responseData);
      expect(nextState.loading).toBe(false);
    });

    it('handles addHistoryEntry rejection', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      (api.post as any).mockRejectedValueOnce(new Error('Failed to record activity'));

      const result = await addHistoryEntry({
        serviceType: 'idea_validation',
        title: 'New Idea',
        description: 'New Description',
        data: {},
        creditsUsed: 1,
      })(dispatch, getState, undefined);

      expect(result.type).toBe('history/addHistoryEntry/rejected');
    });
  });
});
