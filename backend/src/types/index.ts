import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export interface EventCreate {
  title: string;
  description: string;
  date: Date;
  location: string;
  image_url?: string;
  available_places: number;
  price: number;
} 