import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '@/app/providers';
import * as Sentry from '@sentry/react';
import App from '@/app/App';
import '@/styles/index.css';
import '@/shared/utils/error.util';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  beforeSend(event, hint) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalException = hint.originalException as any;
    if (originalException?.requestId) {
      if (!event.tags) event.tags = {};
      event.tags.requestId = originalException.requestId;
    }
    return event;
  }
});

// eslint-disable-next-line react-refresh/only-export-components
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">We've been notified. Please refresh the page.</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
          <App />
        </Sentry.ErrorBoundary>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
);
