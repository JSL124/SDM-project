# AGENT.md - Create Account Feature Guide

## 1. Purpose and Scope

This guide applies to create account related work only.

Use this file when the task touches any of the following:

- `frontend/src/feature/account`
- `frontend/src/app/admin/create-account/page.tsx`
- `backend/src/account`
- `backend/src/routes/accountRoutes.ts`
- `backend/src/login/entity/UserAccount.ts`
- `backend/src/profile/entity/UserProfile.ts`
- `docs/account`

This file supplements the repository-wide rules in the root `AGENT.md`. Shared architecture, BCE, and TDD rules still come from the root guide.

## 2. Related Code Locations

- Frontend boundary: `frontend/src/feature/account/boundary/CreateAccountPage.tsx`
- Frontend page: `frontend/src/app/admin/create-account/page.tsx`
- Backend controller: `backend/src/account/controller/CreateAccountController.ts`
- Backend entity: `backend/src/login/entity/UserAccount.ts`
- Supporting entity: `backend/src/profile/entity/UserProfile.ts`
- HTTP route adapter: `backend/src/routes/accountRoutes.ts`
- Backend tests: `backend/test/controller`, `backend/test/entity`, `backend/test/routes`

## 3. Related Design Documents

Create account work MUST stay consistent with the design documents in `docs/account/`:

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

- Create account work MUST preserve BCE separation across boundary, controller, entity, and database access
- Create account boundary validation MUST happen before the backend call
- Create account route handlers stay thin and only map HTTP requests to controller calls
- Create account specific success and failure messages MUST remain consistent with the approved design artifacts
- Create account changes MUST NOT bypass the dedicated create account controller or access the entity directly from the frontend
- Only a `User admin` can use the create account page in the current implementation

## 5. Required Create Account Test Coverage

The automated create account test set MUST cover:

- No message before submit
- Access denied for non-User admin role
- Empty profile ID
- Empty username
- Empty password
- Missing role selection
- Username already exists
- Profile not found
- Backend unavailable
- Successful account creation

## 6. Local Quality Gate for Create Account Changes

For create account feature changes across BCE layers, run all of the following:

- `cd backend && npm test`
- `cd frontend && npm run lint`
- `cd frontend && npm test`

If the change is limited to one layer but still affects create account behavior, prefer running the full quality gate instead of a partial check.

## 7. Verification Checklist

Before considering create account work complete, verify:

- Create account code still matches the create account diagrams and use case wording
- Boundary validation behavior matches `docs/account/test-cases.md`
- Controller and entity logic remain independently testable
- Route behavior still maps controller results correctly
- The linked profile email is persisted into `user_account`
- No create-account specific rule is duplicated back into the root `AGENT.md`
