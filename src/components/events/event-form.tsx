import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { EventData } from '../../types';
import { useAuthStore } from '../../store/auth-store';

interface EventFormProps {
  event?: EventData;
  onSubmit: (eventData: Omit<EventData, 'id' | 'createdAt' | 'attendees'>) => Promise<void>;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) {
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
      availablePlaces: Number(formData.get('availablePlaces')),
      price: Number(formData.get('price')),
      organizerId: user.id
    };

    try {
      await onSubmit(eventData);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
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
          placeholder="Enter event title"
        />

        <Input
          label="Description"
          name="description"
          defaultValue={event?.description}
          required
          placeholder="Enter event description"
        />

        <Input
          label="Date"
          name="date"
          type="datetime-local"
          defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : undefined}
          required
        />

        <Input
          label="Location"
          name="location"
          defaultValue={event?.location}
          required
          placeholder="Enter event location"
        />

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