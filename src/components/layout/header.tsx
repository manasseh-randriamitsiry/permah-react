import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">EventManager</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/events" className="text-gray-600 hover:text-gray-900">
            Events
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}