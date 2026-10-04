/**
 * Global error message extraction utility.
 * Extracts a readable error string from unknown error types (Axios error, Error, string, etc.).
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'An error occurred'): string {
  if (error === null || error === undefined) {
    return fallbackMessage;
  }
  if (typeof error === 'string') return error;

  if (typeof error === 'object') {
    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

    if (err.response?.data?.message && typeof err.response.data.message === 'string') {
      return err.response.data.message;
    }
    if (err.response?.data?.error && typeof err.response.data.error === 'string') {
      return err.response.data.error;
    }
    if (err.message && typeof err.message === 'string') {
      return err.message;
    }
  }

  return fallbackMessage;
}

// Bind to globalThis so ambient function calls resolve at runtime across browsers, node, and tests
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { getErrorMessage: typeof getErrorMessage }).getErrorMessage = getErrorMessage;
}
