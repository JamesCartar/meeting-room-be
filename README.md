# Meeting Backend

Backend API for the meeting room booking project. It is built with Node.js, Express, TypeScript, MongoDB, Mongoose, Zod, JWT auth, and Biome.

## Requirements

- Node.js
- npm
- MongoDB connection string

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Fill in `.env`:

```env
ENVIRONMENT=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secret_key
JWT_EXPIRATION_TIME=3600
PASSWORD_SALT_ROUNDS=10
TRUSTED_ORIGINS=http://localhost:3000
RATE_LIMIT_DURATION=3
RATE_LIMIT_MAX_REQUESTS=20
```

4. Start the development server:

```bash
npm run dev
```

The API health check should be available at:

```text
http://localhost:5000/health
```

## Useful Commands

```bash
npm run dev          # Start local dev server
npm run build        # Compile TypeScript into dist/
npm start            # Run compiled production build
npm run type-check   # Check TypeScript errors
npm run lint         # Run Biome lint
npm run format       # Check formatting
npm run check        # Run Biome checks
npm run seed         # Seed default database data
```

## Project Structure

```text
src/
  config/        Environment and database setup
  controllers/   Request handlers
  services/      Business logic
  repositories/  Database access
  db/models/     Mongoose models
  routes/        API route definitions
  validators/    Zod validation schemas
  middlewares/   Auth, rate limit, and error handling
  helpers/       Shared response and error helpers
```

## Development Notes

- Add new API routes under `src/routes`.
- Keep business logic in `src/services`.
- Keep direct database queries in `src/repositories`.
- Validate request bodies with Zod schemas in `src/validators`.
- Run `npm run build` before deploying or opening a pull request.

Do not commit `.env`, `node_modules`, or `dist`.
