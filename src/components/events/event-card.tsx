import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';

interface EventCardProps {
  event: EventData;
  onJoin: () => Promise<void>;
}

export function EventCard({ event, onJoin }: EventCardProps) {
  const { user } = useAuthStore();
  const [isJoining, setIsJoining] = React.useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    if (!user) return;
    setIsJoining(true);
    try {
      await onJoin();
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOrganizer = event.organizer_id === user?.id;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        {event.image_url && (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}

        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{event.available_places} spots available</span>
          </div>

          <div className="text-sm text-gray-500">
            Price: ${event.price}
          </div>

          {!isOrganizer && (
            <Button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? 'Joining...' : 'Join Event'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}