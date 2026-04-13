# Use Case: Create User Profile

## Use Case ID
UC-PROFILE-01

## Goal
Allow a User Admin to create a new user profile by entering the user's personal details into the system.

## Primary Actor
User Admin

## Supporting Components
- `CreateProfilePage` as the boundary at `frontend/src/feature/profile/boundary/CreateProfilePage.tsx`
- `POST /api/profile` as the HTTP API route at `backend/src/routes/profileRoutes.ts`
- `ProfileController` as the controller at `backend/src/profile/controller/ProfileController.ts`
- `UserProfile` as the entity at `backend/src/profile/entity/UserProfile.ts`
- `user_profile` table in PostgreSQL

## Preconditions
- The User Admin needs to be logged in.
- The User Admin needs to have permission to manage users.
- The user account does not already exist.

## Postconditions
Success:
- A new user profile is saved in the system.
- A success message is displayed confirming the profile was created.

Failure:
- No profile is created.
- An appropriate error message is displayed on the create profile page.

## Trigger
The User Admin selects the "Create User Profile" option from the system interface.
