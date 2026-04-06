# CRM Dashboard Backend

RESTful API backend for the CRM Dashboard application — a Church Management System for managing members, cell groups (CGF), attendance, ministries, events, and analytics.

Built with **Express.js**, **TypeScript**, and **PostgreSQL**.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js     | >= 18.0.0 |
| PostgreSQL  | >= 14.0 |
| npm         | >= 9.0 |

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd crm-dashboard/backend

# Install dependencies
npm install
```

## Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crm_dashboard
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_dashboard
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Setup

```bash
# Create the database
createdb crm_dashboard

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Reset database (drop, migrate, and seed)
npm run db:reset
```

## Running the Server

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

The server starts at `http://localhost:3000`. API base path: `/api/v1`.

## API Documentation

Swagger UI is available at `http://localhost:3000/api-docs` when the server is running.

The OpenAPI specification is also available at [`openapi.yaml`](./openapi.yaml).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint source files |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:reset` | Reset database (migrate + seed) |

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration (database, swagger, app config)
│   ├── controllers/      # Request handlers (business logic)
│   ├── middleware/        # Express middleware (auth, CORS, rate limiting, error handling)
│   ├── models/           # Database query models
│   ├── routes/           # Route definitions and validators
│   ├── utils/            # Utility functions
│   └── index.ts          # Application entry point
├── scripts/              # Database scripts (migrations, seeders)
├── migrations/           # SQL migration files
├── tests/                # Test files
├── docs/                 # Documentation
├── .env.example          # Environment template
├── openapi.yaml          # OpenAPI 3.0 specification
├── package.json
└── tsconfig.json
```

## API Endpoints

All endpoints are prefixed with `/api/v1`. See [docs/API.md](./docs/API.md) for full reference.

| Resource | Endpoint | Methods |
|----------|----------|---------|
| **Members** | `/members` | `GET` `POST` |
| | `/members/:no_jemaat` | `GET` `PUT` `PATCH` `DELETE` |
| | `/members/:no_jemaat/events` | `GET` |
| | `/members/:no_jemaat/status-history` | `GET` |
| **Attendance** | `/attendance` | `GET` `POST` |
| | `/attendance/bulk` | `POST` |
| | `/attendance/:id` | `GET` `PUT` `DELETE` |
| **CGF Groups** | `/groups` | `GET` `POST` |
| | `/groups/:cgId` | `GET` `PUT` `DELETE` |
| | `/groups/:cgId/members` | `GET` `POST` |
| | `/groups/:cgId/members/:noJemaat` | `PUT` `DELETE` |
| **Events** | `/events` | `GET` `POST` |
| | `/events/:eventId` | `GET` `PUT` `DELETE` |
| | `/events/:eventId/participants` | `GET` `POST` |
| | `/events/:eventId/participants/:id` | `PUT` `DELETE` |
| **Ministry** | `/types` | `GET` `POST` |
| | `/types/:pelayananId` | `GET` `PUT` `DELETE` |
| | `/pelayan` | `GET` `POST` |
| | `/pelayan/:no_jemaat` | `GET` `PUT` `PATCH` `DELETE` |
| **Status** | `/status-history` | `GET` `POST` |
| | `/status-history/:id` | `GET` `PUT` `DELETE` |
| **Analytics** | `/analytics/dashboard` | `GET` |
| | `/analytics/members/distribution` | `GET` |
| | `/analytics/members/trends` | `GET` |
| | `/analytics/members/birthday` | `GET` |
| | `/analytics/attendance/summary` | `GET` |
| | `/analytics/attendance/trends` | `GET` |
| | `/analytics/cgf/summary` | `GET` |
| | `/analytics/ministry/summary` | `GET` |
| | `/analytics/events/summary` | `GET` |
| **Health** | `/health` | `GET` |
