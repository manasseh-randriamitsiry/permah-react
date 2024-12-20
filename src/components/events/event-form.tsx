import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { EventData } from '../../types';
import { useAuthStore } from '../../store/auth-store';

interface EventFormProps {
  event?: EventData;
  onSubmit: (eventData: Omit<EventData, 'id' | 'created_at' | 'updated_at' | 'organizer_id'>) => Promise<void>;
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
    const date = new Date(formData.get('date') as string);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formattedDate,
      location: formData.get('location') as string,
      image_url: formData.get('image_url') as string,
      available_places: Number(formData.get('available_places')),
      price: Number(formData.get('price'))
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
          label="Available Places"
          name="available_places"
          type="number"
          min="1"
          defaultValue={event?.available_places ?? ''}
          required
          placeholder="e.g., 50"
        />

        <Input
          label="Event Image URL"
          name="image_url"
          type="url"
          defaultValue={event?.image_url}
          required
          placeholder="https://example.com/image.jpg"
        />

        <Input
          label="Price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={event?.price ?? '0'}
          required
          placeholder="e.g., 99.99"
        />

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