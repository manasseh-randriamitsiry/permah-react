import React from 'react';
import { EventCard } from './event-card';
import { eventApi } from '../../services/api';
import type { EventData } from '../../types';

export function EventList() {
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAll();
        setEvents(response.data);
        console.log('Fetched events:', response.data); // Debug log
      } catch (err: any) {
        console.error('Error fetching events:', err); // Debug log
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-8">Loading events...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events found. Be the first to create one!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              onJoin={async () => {
                await eventApi.join(event.id);
                const response = await eventApi.getAll();
                setEvents(response.data);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}