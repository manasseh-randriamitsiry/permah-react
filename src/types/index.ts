export interface User {
  id: number;
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
  organizer_id: number;
  created_at: Date;
  updated_at: Date;
  attendees?: Array<{
    id: number;
    name: string;
  }>;
}