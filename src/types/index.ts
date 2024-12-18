export interface User {
  id: string;
  name: string;
  email: string;
  membershipLevel: 'free' | 'paid';
  createdAt: Date;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
  availablePlaces: number;
  price: number;
  organizerId: string;
  attendees: string[];
  createdAt: Date;
}