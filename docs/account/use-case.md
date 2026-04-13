# Use Case: Create User Account

## Use Case ID
UC-ACCOUNT-01

## Goal
Allow a user admin to create a new user account linked to an existing user profile.

## Primary Actor
User Admin

## Supporting Components
- `CreateAccountPage` as the boundary at `frontend/src/feature/account/boundary/CreateAccountPage.tsx`
- `CreateAccountController` as the controller at `backend/src/account/controller/CreateAccountController.ts`
- `UserAccount` as the main entity at `backend/src/login/entity/UserAccount.ts`
- `UserProfile` as the supporting entity at `backend/src/profile/entity/UserProfile.ts`
- `user_account` and `user_profile` tables in PostgreSQL

## Preconditions
- The user admin needs to be logged in.
- The user admin needs to have permission to create user accounts.
- A corresponding user profile already exists.

## Postconditions
Success:
- A new user account is saved in the system.
- The new account is linked to the selected user profile.
- A success message is displayed confirming the account was created.

Failure:
- No account is created.
- An appropriate error message is displayed on the create account page.

## Trigger
The user admin selects the "Create User Account" option from the system interface.
