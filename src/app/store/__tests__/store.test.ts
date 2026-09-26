import { describe, it, expect } from 'vitest';
import { store } from '@/app/store';

describe('Redux store configuration (src/app/store/index.ts)', () => {
  it('initializes store with all required slice reducers', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('idea');
    expect(state).toHaveProperty('history');
    expect(state).toHaveProperty('credits');
  });

  it('has valid default initial state for each slice', () => {
    const state = store.getState();
    expect(Array.isArray(state.idea.ideas)).toBe(true);
    expect(Array.isArray(state.history.history)).toBe(true);
    expect(typeof state.credits.plans).toBe('object');
  });
});
