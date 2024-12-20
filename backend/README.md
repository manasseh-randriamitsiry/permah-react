#make migration
npx typeorm migration:generate -n CreateTables
npm run typeorm migration:generate src/migrations/CreateTables -- -d src/config/datasource.ts

# Event Management API

A RESTful API for managing events and attendees.

## Authentication

### Register User

http
POST /auth/register
Content-Type: application/json
{
"email": "user@example.com",
"password": "password123",
"name": "John Doe"
}

### Login
http
POST /auth/login
Content-Type: application/json
{
"email": "user@example.com",### Update Event
http
Authorization: Bearer <your_jwt_token>
PUT /events/:id
Content-Type: application/json
{
"title": "Updated Event Title",### Update Event
http
Authorization: Bearer <your_jwt_token>
PUT /events/:id
Content-Type: application/json
{
"title": "Updated Event Title",
"description": "Updated Event Description",
"date": "2024-01-01T10:00:00Z",
"location": "Updated Event Location",
"maxAttendees": 150
}
"description": "Updated Event Description",
"date": "2024-01-01T10:00:00Z",
"location": "Updated Event Location",
"maxAttendees": 150
}
"password": "password123"
}


Response includes a JWT token to be used in subsequent requests.

## Events

All event endpoints (except GET) require authentication via Bearer token in the header:

### List All Events
http
Authorization: Bearer <your_jwt_token>

### List All Events
http
GET /events

### Get Single Event
http
GET /events/:id

### Create Event
http
Authorization: Bearer <your_jwt_token>
POST /events
Content-Type: application/json
{
"title": "Event Title",
"description": "Event Description",
"date": "2024-01-01T10:00:00Z",
"location": "Event Location",
"maxAttendees": 100
}


### Update Event
http
Authorization: Bearer <your_jwt_token>
PUT /events/:id
Content-Type: application/json
{
"title": "Updated Event Title",
"description": "Updated Event Description",
"date": "2024-01-01T10:00:00Z",
"location": "Updated Event Location",
"maxAttendees": 150
}

### Delete Event

http
DELETE /events/:id

### Join Event
http
POST /events/:id/join

http
DELETE /events/:id/leave
## Response Formats

### Success Response
json
{
"id": 1,
"title": "Tech Conference 2024",
"description": "Annual technology conference",
"date": "2024-06-15T09:00:00Z",
"location": "Convention Center",
"maxAttendees": 100,
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

### Error Response
json
{
"message": "Error message here"
}


## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error