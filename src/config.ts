const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev 
  ? 'http://localhost:3000/api'
  : '/api'; // In production, use relative path