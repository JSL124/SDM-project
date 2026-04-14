# AGENT.md - Create Fundraising Activity Feature Guide

## 1. Purpose and Scope

This guide applies to create fundraising activity related work only.

Use this file when the task touches any of the following:

- `frontend/src/feature/fundraising`
- `frontend/src/app/fundraiser/create-fundraising-activity/page.tsx`
- `frontend/src/app/fundraiser/manage-activities/page.tsx`
- `backend/src/fundraising`
- `backend/src/routes/fundraisingRoutes.ts`
- `backend/sql/004-add-fundraising-activity.sql`
- `docs/fundraising`

This file supplements the repository-wide rules in the root `AGENT.md`. Shared architecture, BCE, and TDD rules still come from the root guide.

## 2. Related Code Locations

- Frontend boundary: `frontend/src/feature/fundraising/boundary/CreateFundraisingActivityPage.tsx`
- Frontend page: `frontend/src/app/fundraiser/create-fundraising-activity/page.tsx`
- Manage activities page: `frontend/src/app/fundraiser/manage-activities/page.tsx`
- Backend controller: `backend/src/fundraising/controller/CreateFundraisingActivityController.ts`
- Backend entity: `backend/src/fundraising/entity/FundraisingActivity.ts`
- HTTP route adapter: `backend/src/routes/fundraisingRoutes.ts`
- Backend tests: `backend/test/controller`, `backend/test/entity`, `backend/test/routes`

## 3. Related Design Documents

Create fundraising activity work MUST stay consistent with the design documents in `docs/fundraising/`:

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

- Create fundraising activity work MUST preserve BCE separation across boundary, controller, entity, and database access
- Boundary validation MUST happen before the backend call
- `validateFundraisingActivity(...)` is treated as a boundary concern and documented as returning `boolean`
- Route handlers stay thin and only map HTTP requests to controller calls
- Success and failure messages MUST remain consistent with the approved design artifacts
- Only a `Fundraiser` can use the create fundraising activity page in the current implementation
- Cancel flow returns the user to `/fundraiser/manage-activities`

## 5. Required Create Fundraising Activity Test Coverage

The automated create fundraising activity test set MUST cover:

- No message before submit
- Access denied for non-Fundraiser role
- Empty title
- Empty description
- Empty or invalid target amount
- Empty category
- Empty start date
- Empty end date
- End date on or before start date
- Backend unavailable
- Successful activity creation
- Cancel returning to manage activities

## 6. Local Quality Gate for Create Fundraising Activity Changes

For create fundraising activity feature changes across BCE layers, run all of the following:

- `cd backend && npm test`
- `cd frontend && npm run lint`
- `cd frontend && npm test`

If the change is limited to one layer but still affects create fundraising activity behavior, prefer running the full quality gate instead of a partial check.

## 7. Verification Checklist

Before considering create fundraising activity work complete, verify:

- Create fundraising activity code still matches the diagrams and use case wording
- Boundary validation behavior matches `docs/fundraising/test-cases.md`
- Controller and entity logic remain independently testable
- Route behavior still maps controller results correctly
- Persistence documentation still matches the PostgreSQL schema
- No feature-specific rule is duplicated back into the root `AGENT.md`
