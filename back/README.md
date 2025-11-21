# SN-Radio Backend

Backend API for the SN-Radio web application built with Node.js, TypeScript, Express, Prisma, and BetterAuth.

## Architecture

This backend follows a **layered architecture** pattern matching the frontend structure:

```
back/
├── src/
│   ├── config/           # Configuration files (auth, database, env)
│   ├── controllers/      # HTTP request handlers (presentation layer)
│   ├── services/         # Business logic layer
│   ├── repositories/     # Data access layer
│   ├── middlewares/      # Express middlewares (auth, error handling)
│   ├── routes/           # API route definitions
│   ├── types/            # TypeScript type definitions
│   └── server.ts         # Main application entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## Architecture Layers

### 1. **Controllers Layer** (`src/controllers/`)
- Handles HTTP requests and responses
- Validates request data
- Calls service layer methods
- Returns formatted API responses

### 2. **Services Layer** (`src/services/`)
- Contains business logic
- Orchestrates operations between repositories
- Implements authorization rules
- Transforms data between layers

### 3. **Repositories Layer** (`src/repositories/`)
- Abstracts database operations
- Uses Prisma ORM for type-safe queries
- Single responsibility for each entity

### 4. **Middlewares Layer** (`src/middlewares/`)
- Authentication/authorization
- Error handling
- Request validation

### 5. **Configuration Layer** (`src/config/`)
- BetterAuth setup
- Database connection
- Environment variables

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: BetterAuth
- **Validation**: Zod (optional, can be added)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
cd back
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication (BetterAuth)
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in/email` - Login with email/password
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Users
- `GET /api/users/profile` - Get current user profile (authenticated)
- `GET /api/users` - Get all users (admin only)
- `PATCH /api/users/:userId/role` - Update user role (admin only)
- `DELETE /api/users/:userId` - Delete user (admin only)

### Articles
- `GET /api/articles` - Get all articles (public)
- `GET /api/articles/:articleId` - Get single article (public)
- `POST /api/articles` - Create article (admin only)
- `PATCH /api/articles/:articleId` - Update article (author/admin)
- `DELETE /api/articles/:articleId` - Delete article (author/admin)
- `POST /api/articles/:articleId/like` - Toggle like (authenticated)

### Health Check
- `GET /api/health` - API health check

## Database Schema

The application uses the following main entities:

- **User**: User accounts with authentication
- **Session**: BetterAuth session management
- **Account**: BetterAuth account credentials
- **Article**: News articles/posts
- **ArticleLike**: Many-to-many relationship for article likes

See `prisma/schema.prisma` for the complete schema.

## Environment Variables

See `.env.example` for all required environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for BetterAuth
- `BETTER_AUTH_URL` - BetterAuth base URL
- `FRONTEND_URL` - Frontend application URL (for CORS)

## Security Features

- Helmet.js for security headers
- CORS configuration
- BetterAuth for secure authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Session management

## Development Tools

- **Prisma Studio**: Visual database editor
  ```bash
  npm run prisma:studio
  ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## License

MIT
