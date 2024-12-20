import axios from 'axios';
import type { EventData } from '../types';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventApi = {
  getAll: () => api.get<EventData[]>('/events'),
  getById: (id: number) => api.get<EventData>(`/events/${id}`),
  create: (eventData: Omit<EventData, 'id' | 'created_at' | 'updated_at' | 'organizer_id'>) => 
    api.post<EventData>('/events', eventData),
  update: (id: number, eventData: Partial<EventData>) => 
    api.put<EventData>(`/events/${id}`, eventData),
  delete: (id: number) => api.delete(`/events/${id}`),
  join: (id: number) => api.post(`/events/${id}/join`),
  leave: (id: number) => api.delete(`/events/${id}/leave`),
}; 