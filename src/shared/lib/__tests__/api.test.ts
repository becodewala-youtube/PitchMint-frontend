import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import api from '@/shared/lib/api';

describe('API Client & Interceptors (api.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('has base URL set to API_URL', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('attaches Authorization header if token exists in localStorage', async () => {
    localStorage.setItem('token', 'valid-jwt-token');

    // Get the request interceptor handler
    const requestInterceptor = (api.interceptors.request as any).handlers[0];
    const config = {
      headers: {} as Record<string, string>,
    };

    const updatedConfig = await requestInterceptor.fulfilled(config);
    expect(updatedConfig.headers.Authorization).toBe('Bearer valid-jwt-token');
  });

  it('does not attach Authorization header if token does not exist in localStorage', async () => {
    const requestInterceptor = (api.interceptors.request as any).handlers[0];
    const config = {
      headers: {} as Record<string, string>,
    };

    const updatedConfig = await requestInterceptor.fulfilled(config);
    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });

  it('rejects request interceptor errors', async () => {
    const requestInterceptor = (api.interceptors.request as any).handlers[0];
    const error = new Error('Request setup failed');

    await expect(requestInterceptor.rejected(error)).rejects.toThrow('Request setup failed');
  });

  it('passes through successful responses', async () => {
    const responseInterceptor = (api.interceptors.response as any).handlers[0];
    const response = { status: 200, data: { success: true } };

    const result = responseInterceptor.fulfilled(response);
    expect(result).toBe(response);
  });

  it('handles 401 Unauthorized by removing token from localStorage and rejecting error', async () => {
    localStorage.setItem('token', 'expired-token');

    const responseInterceptor = (api.interceptors.response as any).handlers[0];
    const error401 = {
      response: {
        status: 401,
        data: { message: 'Token expired' },
      },
    };

    await expect(responseInterceptor.rejected(error401)).rejects.toEqual(error401);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('passes through non-401 errors without clearing token', async () => {
    localStorage.setItem('token', 'valid-token');

    const responseInterceptor = (api.interceptors.response as any).handlers[0];
    const error500 = {
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    };

    await expect(responseInterceptor.rejected(error500)).rejects.toEqual(error500);
    expect(localStorage.getItem('token')).toBe('valid-token');
  });
});
