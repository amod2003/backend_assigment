# Teacher Session Booking — Backend API

A REST API for a platform where users book sessions with teachers.

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose

## Prerequisites

- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env and set your MONGO_URI

# 3. Start development server
npm run dev
```

Server starts at `http://localhost:3000`.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/teachers` | Create a teacher |
| POST | `/users` | Create a user |
| POST | `/sessions` | Create a session for a teacher |
| GET | `/sessions/available?dateTimestamp={ms}` | Get all available sessions on a date |
| POST | `/sessions/:id/book` | Book an available session |
| PATCH | `/sessions/:id/complete` | Mark a booked session as complete |
| GET | `/users/:id/sessions` | Get user session history (upcoming + completed) |

### POST /teachers
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "specialization": "Mathematics",
  "experience": 5
}
```

### POST /users
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210"
}
```

### POST /sessions
```json
{
  "teacherId": "<teacher_id>",
  "startTime": "2024-12-01T10:00:00.000Z",
  "endTime": "2024-12-01T11:00:00.000Z"
}
```

### GET /sessions/available
```
GET /sessions/available?dateTimestamp=1733040000000
```
`dateTimestamp` is a Unix timestamp in milliseconds for any time on the target date.

### POST /sessions/:id/book
```json
{
  "userId": "<user_id>"
}
```

### GET /users/:id/sessions
Returns:
```json
{
  "success": true,
  "data": {
    "upcomingSessions": [...],
    "completedSessions": [...]
  }
}
```

## Postman Collection

Import `postman_collection.json` into Postman. Set the `baseUrl` collection variable to `http://localhost:3000`.

Test flow: Create teacher → Create session → Create user → Check available sessions → Book session → Complete session → Check user history.
