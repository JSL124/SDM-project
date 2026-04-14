# Test Plan: Create Fundraising Activity

## Objective
Verify that the create fundraising activity user story satisfies the BCE design, validates fundraiser input correctly in the boundary, persists fundraising activity data to PostgreSQL, and returns appropriate success or failure feedback through the route and controller layers.

## Test Scope
Included:
- Boundary access control for `Fundraiser`
- Boundary input validation
- Controller create activity decision logic
- Entity fundraising activity save operation
- Route response mapping for `POST /api/fundraising-activity`
- Success, failure, and cancel behavior

Excluded:
- Activity editing
- Activity deletion
- Donation transactions
- Activity listing and detail retrieval
- Full backend authorization enforcement

## Test Levels
- Unit tests for `FundraisingActivity` entity save and retrieval methods
- Unit tests for `CreateFundraisingActivityController` create activity logic
- Component or UI tests for `CreateFundraisingActivityPage` boundary validation, access behavior, cancel flow, and success feedback at `frontend/src/feature/fundraising/boundary/CreateFundraisingActivityPage.tsx`
- Route tests for `POST /api/fundraising-activity` response mapping

## Entry Criteria
- Create fundraising activity design artifacts are approved.
- PostgreSQL schema for `fundraising_activity` exists.
- Test data is prepared for valid and invalid input scenarios.

## Exit Criteria
- All planned create fundraising activity test cases pass.
- No critical create activity defects remain open.
- The story is runnable in CI.

## Risks
- Validation responsibility drifting from boundary to controller
- Date validation mismatch between design and implementation
- Route and controller messages becoming inconsistent
- Database insert failure not surfacing the correct boundary feedback
- Error messages appearing before submit due to boundary state regression
