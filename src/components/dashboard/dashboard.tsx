import React from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../services/api';
import { useAuthStore } from '../../store/auth-store';
import { EventCard } from '../events/event-card';
import { Button } from '../ui/button';
import type { EventData } from '../../types';

export function Dashboard() {
  const { user } = useAuthStore();
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const response = await eventApi.getAll();
        // Filter events created by the current user
        const userEvents = response.data.filter(event => event.organizer_id === user?.id);
        setEvents(userEvents);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user?.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Events</h1>
          <p className="text-gray-600">You have created {events.length} events</p>
        </div>
        <Link to="/events/new">
          <Button>Create New Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No events created yet</h3>
          <p className="text-gray-600 mt-2">Start by creating your first event!</p>
          <Link to="/events/new">
            <Button className="mt-4">Create Event</Button>
          </Link>
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
                setEvents(response.data.filter(e => e.organizer_id === user?.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
} 