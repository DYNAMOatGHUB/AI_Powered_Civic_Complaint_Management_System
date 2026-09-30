import axios from 'axios';

// Backend API URL
const DEFAULT_BACKEND_URL = 'http://localhost:8000';

const API_BASE = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL;

const client = axios.create({
  baseURL: API_BASE,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
export { API_BASE };
