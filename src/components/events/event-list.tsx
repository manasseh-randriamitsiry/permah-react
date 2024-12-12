import React from 'react';
import { EventCard } from './event-card';
import type { Event } from '../../types';

// Simulated events data - replace with API call
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn the latest web development techniques and best practices.',
    date: new Date('2024-04-15T10:00:00'),
    location: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
    availablePlaces: 50,
    price: 99.99,
    organizerId: '1',
    attendees: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Design Systems Conference',
    description: 'A deep dive into creating and maintaining design systems.',
    date: new Date('2024-04-20T09:00:00'),
    location: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    availablePlaces: 200,
    price: 299.99,
    organizerId: '2',
    attendees: [],
    createdAt: new Date(),
  },
];

export function EventList() {
  const [events, setEvents] = React.useState<Event[]>(MOCK_EVENTS);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <p className="mt-2 text-gray-600">
          Discover and join amazing events in your area
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}