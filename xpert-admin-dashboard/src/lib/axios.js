import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export async function getCsrfCookie() {
  await axios.get('/sanctum/csrf-cookie');
}

export default api;
