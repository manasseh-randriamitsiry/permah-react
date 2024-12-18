import { create } from 'zustand';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, isAuthenticated: false });
  },
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/users/user');
        set({ user: response.data, isAuthenticated: true });
      } catch (err) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
    }
  },
}));