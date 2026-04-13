# Online Fundraiser Platform

Course project for CSCI314 Software Development Methodologies.

This repository implements an online fundraiser platform using strict BCE architecture:

- Boundary: Next.js frontend
- Controller: Node.js and TypeScript backend controllers
- Entity: TypeScript entity classes with raw SQL via `pg`
- Database: PostgreSQL

The frontend and backend are separate applications. Next.js is used only for the UI layer and communicates with the backend over HTTP.

## Project Structure

```text
.
├── frontend/            # Next.js boundary layer
├── backend/             # Express app, controllers, entities, DB access
├── docs/                # Feature design artifacts and feature-specific guides
├── AGENT.md             # Repository-wide implementation rules
└── CLAUDE.md            # Developer guidance and command reference
```

## Implemented Features

- Login
- Logout
- Create user profile
- Create user account
- Manage users UI

Feature-specific design and implementation rules are documented under `docs/<feature>/`.

## Architecture

The repository follows BCE (Boundary-Control-Entity) communication rules:

```text
Boundary -> HTTP API -> Controller -> Entity -> PostgreSQL
```

Key rules:

- Boundary handles UI, user input, validation, and feedback messages.
- Controller handles one use case and coordinates application flow.
- Entity owns database access and raw SQL.
- Boundary must not access the database directly.
- Controller must not contain SQL or frontend logic.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Express, TypeScript
- Database: PostgreSQL
- DB Access: `pg`
- Testing: Jest, React Testing Library

## Prerequisites

- Node.js
- npm
- PostgreSQL database

## Environment Variables

Create `backend/.env` with the database connection values used by the backend:

```env
PGHOST=your-db-host
PGPORT=5432
PGDATABASE=your-db-name
PGUSER=your-db-user
PGPASSWORD=your-db-password
PORT=8080
```

If `PGHOST` contains `supabase.com`, SSL is enabled automatically by the backend.

## Database Setup

SQL files are located in `backend/sql/`.

Apply them in order:

1. `001-create-tables.sql`
2. `002-seed-test-data.sql`
3. `003-add-account-username-profile-role.sql`

## Installation

Install dependencies for both apps:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Running the Project

Start the backend:

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:8080` by default.

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

## Testing

Backend tests:

```bash
cd backend
npm test
```

Frontend lint and tests:

```bash
cd frontend
npm run lint
npm test
```

Recommended local quality gate before pushing:

```bash
cd backend && npm test
cd frontend && npm run lint && npm test
```

## Design Documentation

Each feature folder in `docs/` contains design artifacts such as:

- User story
- Use case
- Use case description
- Wireframe
- BCE diagram
- Sequence diagram
- Class diagram
- Test plan
- Test cases
- Test data

When working on a feature, check both:

- `AGENT.md` for repository-wide rules
- `docs/<feature>/AGENT.md` for feature-specific rules

## Notes

- This project uses raw SQL and does not use an ORM.
- Design-to-code consistency is enforced across diagrams, code, and tests.
- The project is structured to support CI with backend and frontend validation.
