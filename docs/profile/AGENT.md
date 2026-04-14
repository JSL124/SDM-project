# AGENT.md - Create User Profile Feature Guide

## 1. Purpose and Scope

This guide applies to create user profile related work only.

Use this file when the task touches any of the following:

- `frontend/src/feature/profile`
- `backend/src/profile`
- `docs/profile`
- `backend/src/routes/profileRoutes.ts`

This file supplements the repository-wide rules in the root `AGENT.md`. Shared architecture, BCE, and TDD rules still come from the root guide.

## 2. Related Code Locations

- Frontend boundary: `frontend/src/feature/profile/boundary/CreateProfilePage.tsx`
- Frontend page: `frontend/src/app/admin/create-profile/page.tsx`
- Backend controller: `backend/src/profile/controller/CreateProfileController.ts`
- Backend entity: `backend/src/profile/entity/UserProfile.ts`
- HTTP route adapter: `backend/src/routes/profileRoutes.ts`
- Backend tests: `backend/test/controller`, `backend/test/entity`, `backend/test/routes`

## 3. Related Design Documents

Create profile work MUST stay consistent with the design documents in `docs/profile/`:

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

- Create profile work MUST preserve BCE separation across boundary, controller, entity, and database access
- Create profile boundary validation MUST happen before the backend call
- Create profile route handlers stay thin and only map HTTP requests to controller calls
- Create profile specific success and failure messages MUST remain consistent with the approved design artifacts
- Create profile changes MUST NOT bypass the dedicated profile controller or access the entity directly from the frontend

## 5. Required Create Profile Test Coverage

The automated create profile test set MUST cover:

- No message before submit
- Empty name
- Empty email
- Invalid email format
- Empty phone number
- Empty address
- Email already exists
- Backend unavailable
- Successful profile creation

## 6. Local Quality Gate for Create Profile Changes

For create profile feature changes across BCE layers, run all of the following:

- `cd backend && npm test`
- `cd frontend && npm run lint`
- `cd frontend && npm test`

If the change is limited to one layer but still affects create profile behavior, prefer running the full quality gate instead of a partial check.

## 7. Verification Checklist

Before considering create profile work complete, verify:

- Create profile code still matches the profile diagrams and use case wording
- Boundary validation behavior matches `docs/profile/test-cases.md`
- Controller and entity logic remain independently testable
- Route behavior still maps controller results correctly
- No profile-specific rule is duplicated back into the root `AGENT.md`
