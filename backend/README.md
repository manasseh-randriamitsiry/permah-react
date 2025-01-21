# Event Manager API

A RESTful API for managing events, built with Node.js, TypeScript, Express, and MySQL.

## Features

- 👥 User Authentication (Register/Login)
- 📅 Event Management (CRUD operations)
- 🎫 Event Registration System
- 👮 Role-based Authorization
- 🔍 Event Search & Filtering
- 📊 Attendee Management
- ⏰ Real-time Event Updates

## Table of Contents
- [Setup](#setup)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Events](#events)
  - [Users](#users)
  - [Event Attendees](#event-attendees)

## Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- TypeScript
- npm or yarn

### Frontend
```bash
# Start frontend
cd permah-react
npm install
npm start
```

### Backend
```bash
# Start backend
cd backend
npm install
npm start
```

## Database Setup

```bash
# First, make sure you're in the backend directory
cd backend

# Create test database
mysql -u root -p
CREATE DATABASE event_manager;
CREATE DATABASE event_manager_test;

# Drop existing tables (if needed)
npm run typeorm schema:drop -- -d src/config/datasource.ts

# Generate new migration
npm run typeorm migration:generate src/migrations/CreateTables -- -d src/config/datasource.ts

# Run the migration
npm run typeorm migration:run -- -d src/config/datasource.ts
```

## API Documentation

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```http
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### Events

#### List All Events
```http
GET /events
```

Response:
```json
[
  {
    "id": 1,
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15T09:00:00Z",
    "location": "Convention Center",
    "available_places": 100,
    "price": 0,
    "organizer": 1,
    "created_at": "2024-03-20T12:00:00Z",
    "creator": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    },
    "attendees": []
  }
]
```

#### Get Single Event
```http
GET /events/:id
```

#### Create Event
```http
POST /events
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15T09:00:00Z",
    "location": "Convention Center",
    "available_places": 100,
    "price": 0
}
```

Response:
```json
{
    "id": 1,
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15T09:00:00Z",
    "location": "Convention Center",
    "available_places": 100,
    "price": 0,
    "organizer": 1,
    "created_at": "2024-03-20T12:00:00Z"
}
```

#### Update Event
```http
PUT /events/:id
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
    "title": "Updated Event Title",
    "description": "Updated Event Description",
    "date": "2024-01-01T10:00:00Z",
    "location": "Updated Location",
    "available_places": 150,
    "price": 50
}
```

Note: Only the event organizer can update their own events.

#### Delete Event
```http
DELETE /events/:id
Authorization: Bearer YOUR_TOKEN_HERE
```

Note: Only the event organizer can delete their own events.

### Event Attendees

#### Join Event
```http
POST /events/:id/join
Authorization: Bearer YOUR_TOKEN_HERE
```

Response:
```json
{
    "id": 1,
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15T09:00:00Z",
    "location": "Convention Center",
    "available_places": 99,
    "price": 0,
    "organizer": 1,
    "created_at": "2024-03-20T12:00:00Z",
    "attendees": [
        {
            "id": 1,
            "user": {
                "id": 2,
                "name": "Jane Doe",
                "email": "jane@example.com"
            },
            "created_at": "2024-03-20T12:00:00Z"
        }
    ]
}
```

#### Leave Event
```http
DELETE /events/:id/leave
Authorization: Bearer YOUR_TOKEN_HERE
```

Response:
```json
{
    "message": "Successfully left the event"
}
```

### Error Responses

#### Event Full
```json
{
    "error": "Event is full"
}
```

#### Already Attending
```json
{
    "error": "Already attending this event"
}
```

#### Not Authorized
```json
{
    "error": "Not authorized to update this event"
}
```

#### Event Not Found
```json
{
    "error": "Event not found"
}
```

### Users

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
    "name": "Updated Name",
    "email": "newemail@example.com"
}
```

#### Get User's Events
```http
GET /users/events
Authorization: Bearer YOUR_TOKEN_HERE
```

Query Parameters:
- `type`: "organized" or "attending" (default: both)

### Response Formats

#### Success Response
```json
{
    "id": 1,
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15T09:00:00Z",
    "location": "Convention Center",
    "available_places": 100,
    "organizer": 1,
    "creator": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
    },
    "attendees": [],
    "created_at": "2024-01-01T12:00:00Z"
}
```

#### Error Response
```json
{
    "error": "Error message description"
}
```

### Error Codes
- 200: Success
- 201: Created
- 400: Bad Request - Invalid input
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - Not authorized to perform action
- 404: Not Found - Resource doesn't exist
- 500: Internal Server Error

## Development

### Running Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- event.test.ts

# Run tests with coverage
npm run test:coverage
```

### Development Mode
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=event_manager

# Test Database Configuration
TEST_DB_HOST=localhost
TEST_DB_USER=your_test_db_user
TEST_DB_PASSWORD=your_test_db_password
TEST_DB_NAME=event_manager_test

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Project Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── entities/       # TypeORM entities
│   ├── middleware/     # Express middleware
│   ├── migrations/     # Database migrations
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── tests/         # Test files
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── scripts/           # Helper scripts
└── package.json
```

## License

MIT License