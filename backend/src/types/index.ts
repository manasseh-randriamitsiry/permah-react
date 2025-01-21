import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
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
  available_places: number;
  price: number;
  organizer: string;
  creator_id: number;
  image_url: string;
  created_at: Date;
} 