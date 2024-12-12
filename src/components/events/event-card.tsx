import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { Event } from '../../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-2 h-4 w-4" />
            {event.availablePlaces} spots available
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            ${event.price}
          </span>
          <Link
            to={`/events/${event.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}