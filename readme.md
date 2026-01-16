# Express Access & Refresh Token Auth API

Tried to implement access token and refresh token concept for the first time.

## Features

- Register and login users (no validation, purpose was to understand access/refresh token)
- Issue JWT access and refresh tokens
- Store refresh tokens securely in the database
- Protect routes with middleware
- Centralized error handling
- Consistent API response format

## Tech Stack

- Express
- PostgreSQL

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/coderSuresh/express-access-refresh-token
cd express-access-refresh-token
```

### 2. Install dependencies

```
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRATION=60s
REFRESH_TOKEN_EXPIRATION=7d
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=8000
```

### 4. Set up the database

- Create a PostgreSQL database
- Run the SQL schema in `src/db/schema.sql`

### 5. Start the server

```
npm run dev
```

## API Endpoints

### Auth

- `POST /api/v1/users/register` — Register a new user
- `POST /api/v1/users/login` — Login and receive tokens
- `POST /api/v1/users/refresh` — Refresh access token

### Protected

- `GET /api/v1/protected` — Example protected route (requires valid access token)

## Error & Response Management

- All responses follow a consistent format:

 ```json
 {
  "message": "...",
  "data": {},
  "error": {}
 }
 ```

- Centralized error middleware handles all errors and hides sensitive info in production.
