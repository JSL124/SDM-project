# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Online Fundraiser Platform built with strict BCE (Boundary-Control-Entity) architecture for a CSCI314 Software Development Methodologies course. The frontend and backend are **separate applications** — Next.js must NOT be used as a fullstack framework.

## Commands

### Backend (run from `backend/`)
- **Dev server:** `npm run dev` (uses tsx watch, port 8080 by default)
- **Build:** `npm run build` (tsc)
- **Test all:** `npm test`
- **Test single file:** `npx jest --verbose test/controller/LoginController.test.ts`
- **Test by name:** `npx jest --verbose -t "test name pattern"`

### Frontend (run from `frontend/`)
- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test all:** `npm test`
- **Test single file:** `npx jest --verbose src/feature/login/boundary/LoginBoundary.test.tsx`

### Pre-push quality gate
- Backend changes: `cd backend && npm test`
- Frontend changes: `cd frontend && npm run lint && npm test`

## Architecture

### BCE Layers and Communication Flow

```
Boundary (Frontend) -> HTTP API -> Controller (Backend) -> Entity (Backend) -> PostgreSQL
```

- **Boundary** = Next.js React components in `frontend/src/`. Handles UI, input validation, HTTP calls to backend. Must NEVER access DB or contain business logic.
- **Controller** = TypeScript classes in `backend/src/<feature>/controller/`. One class per use case. Coordinates between HTTP routes and Entity. Must NEVER contain SQL or DB access.
- **Entity** = TypeScript classes in `backend/src/<feature>/entity/`. Handles data modeling and all DB interaction via `pg` raw SQL. Must NEVER contain HTTP or UI logic.

### Backend Structure
- `backend/src/index.ts` — Express server entry point
- `backend/src/db.ts` — PostgreSQL connection pool (`pg` library, no ORM)
- `backend/src/routes/` — Express route handlers that delegate to Controllers
- `backend/src/<feature>/controller/` — Controller classes
- `backend/src/<feature>/entity/` — Entity classes
- `backend/sql/` — Schema (`001-create-tables.sql`) and seed data
- `backend/test/` — Jest tests mirroring `entity/`, `controller/`, `routes/`

### Frontend Structure
- `frontend/src/app/` — Next.js App Router pages and layout
- `frontend/src/feature/<feature>/boundary/` — Boundary classes/components (BCE layer)
- `frontend/src/components/` — Reusable UI components (`ui/`, `sections/`, `layout/`, `blocks/`)
- Frontend tests live alongside source files (`*.test.tsx`)

### Database
- PostgreSQL, configured via env vars: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
- Supabase hosting detected automatically (enables SSL)
- All DB access through `backend/src/db.ts` `query()` function with raw SQL

## Design-Code Consistency (Critical)

All code MUST match the design artifacts in `docs/<feature>/` exactly:
- Method names, parameter names, return types, and field names must be identical between diagrams and code
- `Promise<T>` wrappers are acceptable for async operations
- Feature-specific rules are in `docs/<feature>/AGENT.md`
- Root-level rules are in `AGENT.md`

## Adding a New Feature

1. Create design docs under `docs/<feature>/` (user story, use case, wireframe, BCE diagram, sequence diagram, class diagram)
2. Create `docs/<feature>/AGENT.md` with feature-specific rules
3. Write tests first (TDD), then implement Entity -> Controller -> routes -> Boundary
4. Backend code goes in `backend/src/<feature>/controller/` and `backend/src/<feature>/entity/`
5. Frontend boundary code goes in `frontend/src/feature/<feature>/boundary/`
6. Add Express routes in `backend/src/routes/` and register in `backend/src/index.ts`

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR:
- Backend: `npm ci && npm test`
- Frontend: `npm ci && npm run lint && npm test`
