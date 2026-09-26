import axios from 'axios';
import { API_URL } from '@/config/constants';
import '@/shared/utils/error.util';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      import('@/app/store').then(({ store }) => {
        store.dispatch({ type: 'auth/logout' });
      }).catch(() => {});
    }
    return Promise.reject(error);
  }
);
export default api;
