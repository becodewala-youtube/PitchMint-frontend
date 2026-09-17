export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const APP_CONFIG = {
  name: 'PitchMint',
  tagline: 'Your startup journey',
  apiTimeout: 15000,
} as const;
