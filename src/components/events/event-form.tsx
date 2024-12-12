import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import type { Event } from '../../types';

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Omit<Event, 'id' | 'createdAt' | 'attendees'>) => Promise<void>;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create an event');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: new Date(formData.get('date') as string),
      location: formData.get('location') as string,
      imageUrl: formData.get('imageUrl') as string,
      availablePlaces: parseInt(formData.get('availablePlaces') as string, 10),
      price: parseFloat(formData.get('price') as string),
      organizerId: user.id,
    };

    try {
      await onSubmit(eventData);
      navigate('/events');
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {event ? 'Edit Event' : 'Create New Event'}
        </h2>
        <p className="mt-2 text-gray-600">
          Fill in the details below to {event ? 'update your' : 'create a new'} event
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Event Title"
          name="title"
          defaultValue={event?.title}
          required
          placeholder="e.g., Web Development Workshop"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={event?.description}
            required
            placeholder="Describe your event..."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Date and Time"
            name="date"
            type="datetime-local"
            defaultValue={event?.date.toISOString().slice(0, 16)}
            required
          />

          <Input
            label="Location"
            name="location"
            defaultValue={event?.location}
            required
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <Input
          label="Event Image URL"
          name="imageUrl"
          type="url"
          defaultValue={event?.imageUrl}
          required
          placeholder="https://example.com/image.jpg"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Available Places"
            name="availablePlaces"
            type="number"
            min="1"
            defaultValue={event?.availablePlaces}
            required
            placeholder="e.g., 50"
          />

          <Input
            label="Price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={event?.price}
            required
            placeholder="e.g., 99.99"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/events')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}