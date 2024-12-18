import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Restore token from localStorage on app reload
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and auth state on unauthorized
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
); 