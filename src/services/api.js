import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Adjust the port if necessary

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API calls
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const fetchEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// Add more API functions as needed 