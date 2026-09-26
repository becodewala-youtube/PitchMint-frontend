import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '@/shared/utils/error.util';

describe('error.util - getErrorMessage', () => {
  it('returns fallback message when error is undefined or null', () => {
    expect(getErrorMessage(undefined)).toBe('An error occurred');
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
  });

  it('returns the error string when error is a string', () => {
    expect(getErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('extracts message from Axios-like response.data.message', () => {
    const error = {
      response: {
        data: {
          message: 'Invalid credentials provided',
        },
      },
    };
    expect(getErrorMessage(error)).toBe('Invalid credentials provided');
  });

  it('extracts error from Axios-like response.data.error', () => {
    const error = {
      response: {
        data: {
          error: 'Rate limit exceeded',
        },
      },
    };
    expect(getErrorMessage(error)).toBe('Rate limit exceeded');
  });

  it('extracts message from standard Error object', () => {
    const error = new Error('Network timeout');
    expect(getErrorMessage(error)).toBe('Network timeout');
  });

  it('returns fallback when error is an object without message or response', () => {
    expect(getErrorMessage({}, 'Unknown failure')).toBe('Unknown failure');
    expect(getErrorMessage({ foo: 'bar' })).toBe('An error occurred');
  });

  it('is bound to globalThis for ambient calls', () => {
    expect(typeof globalThis.getErrorMessage).toBe('function');
    expect(globalThis.getErrorMessage('Global test')).toBe('Global test');
  });
});
