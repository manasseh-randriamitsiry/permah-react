import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/header';
import { LoginForm } from './components/auth/login-form';
import { SignupForm } from './components/auth/signup-form';
import { EventList } from './components/events/event-list';
import { EventForm } from './components/events/event-form';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/new" element={<CreateEvent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Manage Your Events with Ease
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Create, manage, and join events seamlessly with our platform. Perfect for organizers and attendees alike.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/events"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Browse Events
        </a>
        <a href="/events/new" className="text-sm font-semibold leading-6 text-gray-900">
          Create Event <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

function CreateEvent() {
  const handleSubmit = async (eventData: Omit<Event, 'id' | 'createdAt' | 'attendees'>) => {
    // Simulated API call - replace with actual API implementation
    console.log('Creating event:', eventData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return <EventForm onSubmit={handleSubmit} />;
}

export default App;