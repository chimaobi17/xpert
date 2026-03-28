import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export async function getCsrfCookie() {
  await axios.get(`${API_BASE}/sanctum/csrf-cookie`, { withCredentials: true });
}

export default api;
