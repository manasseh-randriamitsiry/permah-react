# permah-react + backend express + orm

# API
# Event Management API

A RESTful API for managing events and attendees.

## Authentication

### Register User

```http
POST /auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

Response includes a JWT token to be used in subsequent requests.

## Events

All event endpoints (except GET) require authentication via Bearer token in the header.

### List All Events

```http
GET /events
Authorization: Bearer <your_jwt_token>
```

### Get Single Event

```http
GET /events/:id
Authorization: Bearer <your_jwt_token>
```

### Create Event

```http
POST /events
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15T09:00:00Z",  // Ensure consistent date format
    "location": "Convention Center",
    "available_places": 100,
    "price": 0,
    "image_url": "https://example.com/image.jpg"
}
```

### Update Event

```http
PUT /events/:id
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "title": "Updated Event Title",
    "description": "Updated Event Description",
    "date": "2024-01-01T10:00:00Z",
    "location": "Updated Event Location",
    "available_places": 150
}
```

### Delete Event

```http
DELETE /events/:id
Authorization: Bearer <your_jwt_token>
```

### Join Event

```http
POST /events/:id/join
Authorization: Bearer <your_jwt_token>
```

### Leave Event

```http
DELETE /events/:id/leave
Authorization: Bearer <your_jwt_token>
```

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
    "creatorId": 1,
    "creator": {
        "id": 1,
        "name": "John Doe",
        "email": "user@example.com"
    },
    "attendees": [],
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
}
```

#### Error Response

```json
{
    "message": "Error message here"
}
```

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Starting Server

```bash
# Start frontend
cd permah-react
npm install
npm start

# Then start the backend
cd backend
npm install
npm start

# First, make sure you're in the backend directory
cd backend

# Drop existing tables
npm run typeorm schema:drop -- -d src/config/datasource.ts

# Generate new migration
npm run typeorm migration:generate src/migrations/CreateTables -- -d src/config/datasource.ts

# Run the migration
npm run typeorm migration:run -- -d src/config/datasource.ts