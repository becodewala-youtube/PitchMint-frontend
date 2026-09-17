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

export default api;
