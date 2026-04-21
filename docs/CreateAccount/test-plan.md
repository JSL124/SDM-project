# Test Plan: Create User Account

## Objective
Verify that the create user account user story satisfies the BCE design, validates user input correctly, checks username uniqueness through the backend, verifies that the linked profile exists, persists account data to PostgreSQL, and returns appropriate user feedback for success and failure scenarios.

## Test Scope
Included:
- Boundary access control for `User admin`
- Boundary input validation
- Controller create account decision logic
- Entity username existence check
- Entity account save operation
- Supporting profile lookup by ID
- Success and failure responses

Excluded:
- User profile creation
- Account editing
- Account deletion
- Password reset
- Full backend authorization enforcement

## Test Levels
- Unit tests for `UserAccount` entity methods (`existsByUsername`, `saveAccount`)
- Unit tests for `CreateAccountController` create account logic
- Component or UI tests for `CreateAccountPage` boundary validation and access behavior at `frontend/src/feature/CreateAccount/boundary/CreateAccountPage.tsx`
- Route tests for `POST /api/account` response mapping

## Entry Criteria
- Create account design artifacts are approved.
- PostgreSQL schema for `user_account` and `user_profile` exists.
- Test data is prepared, including an existing profile and an existing username.

## Exit Criteria
- All planned create account test cases pass.
- No critical account creation defects remain open.
- The create account story is runnable in CI.

## Risks
- Mismatch between design method names and implementation method names
- Username uniqueness not enforced correctly
- Profile lookup failing for valid profile IDs
- Account persistence failing because `user_account.email` is not populated
- Backend unavailable during integration testing
- Error messages appearing before submit due to boundary state regression
