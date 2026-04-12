# Test Plan: Fundraiser Login

## Objective
Verify that the login user story satisfies the BCE design, validates user input correctly, authenticates against PostgreSQL through the backend, and returns appropriate user feedback for success and failure scenarios.

## Test Scope
Included:
- Boundary input validation
- Controller login decision logic
- Entity or repository account lookup
- Password verification behavior
- Success and failure responses

Excluded:
- Registration
- Logout
- Password reset
- Dashboard feature testing beyond redirection after login

## Test Levels
- Unit tests for `LoginController`
- Unit tests for `UserAccount` password verification logic
- Component or UI tests for `LoginPage` boundary validation behavior at `frontend/src/feature/login/boundary/LoginBoundary.tsx`
- Integration tests for backend login endpoint with PostgreSQL test data
- Route tests for `POST /api/login` response mapping

## Entry Criteria
- Login design artifacts are approved.
- PostgreSQL schema for `user_account` exists.
- Test account data is prepared.

## Exit Criteria
- All planned login test cases pass.
- No critical authentication defects remain open.
- The login story is runnable in CI.

## Risks
- Mismatch between design method names and implementation method names
- Incorrect password hashing setup
- Backend unavailable during integration testing
- Test data not matching expected account states
- Error messages appearing before submit due to boundary state regression
