import axios from 'axios';
import { store } from '@/app/store';
import { API_URL } from '@/config/constants';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid circular dependency by dispatching the raw action type
      store.dispatch({ type: 'auth/logout' });
      // Optionally redirect to login, but React Router handles auth state changes natively via ProtectedRoutes
    }
    return Promise.reject(error);
  }
);
export default api;
