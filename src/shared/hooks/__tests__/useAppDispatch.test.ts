import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '../useAppDispatch';
import { createTestStore } from '../../../../tests/setup/test-utils';
import { Provider } from 'react-redux';
import React from 'react';

describe('useAppDispatch and useAppSelector hooks', () => {
  it('provides the typed store dispatch function', () => {
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(Provider, { store } as any, children)
    );

    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  it('selects state using useAppSelector', () => {
    const store = createTestStore({
      auth: {
        token: 'hook-test-token',
        user: { _id: 'u1', name: 'Hook User', email: 'hook@test.com', credits: 10, isVerified: true, isPremium: false } as any,
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(Provider, { store } as any, children)
    );

    const { result } = renderHook(() => useAppSelector((state) => state.auth.user?.name), { wrapper });
    expect(result.current).toBe('Hook User');
  });
});
