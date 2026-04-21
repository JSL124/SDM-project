# AGENT.md - Login Feature Guide

## 1. Purpose and Scope

This guide applies to login-related work only.

Use this file when the task touches any of the following:

- `frontend/src/feature/login`
- `backend/src/Login`
- `docs/login`
- `backend/src/routes/loginRoutes.ts`

This file supplements the repository-wide rules in the root `AGENT.md`. Shared architecture, BCE, and TDD rules still come from the root guide.

## 2. Related Code Locations

- Frontend boundary: `frontend/src/feature/login/boundary/LoginBoundary.tsx`
- Frontend composition entry: `frontend/src/components/blocks/login-section.tsx`
- Backend controller: `backend/src/Login/controller/LoginController.ts`
- Backend entity: `backend/src/shared/entity/UserAccount.ts`
- HTTP route adapter: `backend/src/routes/loginRoutes.ts`
- Backend tests: `backend/test/controller`, `backend/test/entity`, `backend/test/routes`

## 3. Related Design Documents

Login work MUST stay consistent with the design documents in `docs/login/`:

- `user-story.md`
- `use-case.md`
- `use-case-description.md`
- `wireframe.md`
- `bce-diagram.md`
- `sequence-diagram.md`
- `class-diagram.md`
- `data-persistence.md`
- `test-plan.md`
- `test-cases.md`
- `test-data.md`

## 4. Feature-Specific Rules

- Login work MUST preserve BCE separation across boundary, controller, entity, and database access
- Login boundary validation MUST happen before the backend call
- Login route handlers stay thin and only map HTTP requests to controller calls
- Login-specific success and failure messages MUST remain consistent with the approved login design artifacts
- Login changes MUST NOT bypass the dedicated login controller or access the entity directly from the frontend

## 5. Required Login Test Coverage

The automated login test set MUST cover:

- No message before submit
- Empty email
- Invalid email format
- Empty password
- Login returns null when account does not exist
- Login returns null when password is invalid
- Backend unavailable
- Successful login

## 6. Local Quality Gate for Login Changes

For login feature changes across BCE layers, run all of the following:

- `cd backend && npm test`
- `cd frontend && npm run lint`
- `cd frontend && npm test`

If the change is limited to one layer but still affects login behavior, prefer running the full login quality gate instead of a partial check.

## 7. Verification Checklist

Before considering login work complete, verify:

- Login code still matches the login diagrams and use case wording
- Boundary validation behavior matches `docs/login/test-cases.md`
- Controller and entity logic remain independently testable
- Route behavior still maps controller results correctly
- No login-specific rule is duplicated back into the root `AGENT.md`
