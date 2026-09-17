export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const;
