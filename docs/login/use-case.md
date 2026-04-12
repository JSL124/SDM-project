# Use Case: Fundraiser Login

## Use Case ID
UC-LOGIN-01

## Goal
Authenticate a fundraiser and grant access to the fundraiser dashboard.

## Primary Actor
Fundraiser

## Supporting Components
- `LoginPage` as the boundary at `frontend/src/feature/login/boundary/LoginBoundary.tsx`
- `LoginController` as the controller at `backend/src/login/controller/LoginController.ts`
- `UserAccount` as the entity at `backend/src/login/entity/UserAccount.ts`
- `user_account` table in PostgreSQL

## Preconditions
- The fundraiser has a registered account.
- The application and database are running.
- The fundraiser is on the login page.

## Postconditions
Success:
- The fundraiser is authenticated.
- The fundraiser is redirected to the dashboard.

Failure:
- Authentication is rejected.
- An appropriate error message is displayed on the login page.

## Trigger
The fundraiser submits the login form.
