export interface User {
  id: string;
  name: string;
  email: string;
  membershipLevel: 'free' | 'paid';
  createdAt: Date;
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  available_places: number;
  price: number;
  image_url: string;
  organizer_id: string;
  created_at: Date;
  updated_at: Date;
}