import { server } from '../../../../../tests/setup/msw/server';
import { http, HttpResponse } from 'msw';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from '@/shared/lib/api';
import { store } from '@/app/store';

describe('Global API Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-jwt');
  });

  it('removes token and dispatches logout on 401 response', async () => {
    server.use(
      http.get('*/api/test-401', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    // Spy on store dispatch
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    try {
      await api.get('/api/test-401');
    } catch (e) {
      // Expected to throw because of 401
    }

    // Give the dynamic import a moment to resolve
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(localStorage.getItem('token')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith({ type: 'auth/logout' });
  });
});
