import axios from 'axios';
import { API_URL } from '@/config/constants';
import '@/shared/utils/error.util';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // PRESERVE ON RETRY: Only generate if it doesn't exist
    if (!config.headers['X-Request-ID']) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        config.headers['X-Request-ID'] = crypto.randomUUID();
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    // CAPTURE BACKEND ID: Authoritative reference
    const reqId = response.headers['x-request-id'];
    if (reqId) {
      (response as typeof response & { requestId?: string }).requestId = reqId;
    }
    return response;
  },
  (error: import('axios').AxiosError & { requestId?: string }) => {
    const reqId = error.response?.headers?.['x-request-id'] || (error.response?.data as { requestId?: string })?.requestId;
    if (reqId) {
      error.requestId = reqId as string;
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      import('@/app/store').then(({ store }) => {
        store.dispatch({ type: 'auth/logout' });
      }).catch(() => {});
    }
    return Promise.reject(error);
  }
);
export default api;
