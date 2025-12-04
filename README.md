# Stage Backend

A Node.js/TypeScript Express API backend for managing watch lists, content, and user authentication.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v22)
- **pnpm** (package manager) - Install with `npm install -g pnpm`
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stage
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/stage?schema=public"

# JWT Configuration
JWT_SECRET="your-secret-key-here"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_USERNAME=""
REDIS_MAX_RETRIES_PER_REQUEST=3

# CORS Configuration
APP_BASE_URL=http://localhost:3001
```

**Note:** Replace the placeholder values with your actual configuration:

- Update `DATABASE_URL` with your PostgreSQL connection string
- Set a strong `JWT_SECRET` for production use
- Update `APP_BASE_URL` to match your frontend application URL

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE stage_db;

# Exit psql
\q
```

#### Run Database Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

#### Seed the Database (Optional)

Populate the database with sample data:

```bash
pnpm db:seed
```

This will create:

- A demo user (username: `demoUser`, password: `password123`)
- Sample genres (Action, Drama, Sci-Fi, Comedy)
- Sample movie content (Inception)
- Sample TV show content (Breaking Bad)

### 5. Start Redis

Make sure Redis is running on your system:

```bash
# macOS (using Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Or run Redis directly
redis-server
```

## Running the Application

### Development Mode

To run the application in development mode, you can use one of the following methods:

#### Option 1: Using ts-node (Recommended for development)

```bash
ts-node src/bin.ts
```

#### Option 2: Build and Run

```bash
# Build the TypeScript code
npx tsc

# Run the compiled JavaScript
node dist/bin.js
```

The server will start on the port specified in your `.env` file (default: `3000`). You should see:

```
stage is running on port 3000
```

### Verify the Application

Visit `http://localhost:3000` in your browser or use curl:

```bash
curl http://localhost:3000
```

You should see: `stage backend is running`

## API Endpoints

The API is available at `/api/v1`. Example endpoints:

- `POST /api/v1/auth/login` - User login
- `GET /api/v1/watch-list` - Get user's watch list
- `POST /api/v1/watch-list` - Add item to watch list
- `DELETE /api/v1/watch-list/:id` - Remove item from watch list

## Running Tests

The project uses **Vitest** for testing. Tests are located in the `src/tests/` directory.

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode



### Run Tests 

```bash
pnpm test 
```

### Test Configuration

Tests are configured to run sequentially to avoid database conflicts. The test configuration is defined in `vitest.config.ts`.

**Note:** Make sure your test database is properly configured and migrations have been run before executing tests.

## Project Structure

```
stage/
├── src/                    # Source TypeScript files
│   ├── bin.ts             # Application entry point
│   ├── index.ts           # Express app setup
│   ├── config.ts          # Configuration
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── lib/               # Library files (Prisma, Redis)
│   ├── utils/             # Utility functions
│   ├── zod/               # Zod validation schemas
│   └── tests/             # Test files
├── prisma/                # Prisma configuration
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Database seeding script
├── dist/                  # Compiled JavaScript (generated)
└── package.json           # Project dependencies and scripts
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check your `DATABASE_URL` in `.env` matches your PostgreSQL configuration
- Ensure the database exists: `psql -U postgres -l`

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping` (should return `PONG`)
- Check Redis connection settings in `.env`
- Ensure Redis is accessible on the specified host and port

### Port Already in Use

If port 3000 is already in use, either:

- Change the `PORT` in your `.env` file
- Stop the process using port 3000

### Prisma Client Not Generated

If you encounter Prisma-related errors:

```bash
pnpm prisma generate
```

## Additional Commands

### Database Management

```bash
# View database in Prisma Studio
pnpm prisma studio

# Reset database (WARNING: This will delete all data)
pnpm prisma migrate reset

# Create a new migration
pnpm prisma migrate dev --name migration_name
```

## License

ISC

## Watchlist API — A brief Explanation of api optimization for performance and scalability

Uses version-based caching so data stays fresh and old cache auto-expires.

Cursor pagination keeps responses fast even for huge watchlists.

Strong DB indexing makes lookups and duplicate checks instant.

Selective field fetching avoids loading unnecessary data.

Fast existence checks using unique indexes.

Single Redis + DB connection pools for efficient high-traffic handling.

Overall: very fast reads, optimized writes, and scalable for millions of users.

