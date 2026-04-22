# User Story: Create User Account

## Story ID
US-ACCOUNT-01

## Title
Create User Account

## User Story
As a user admin, I want to create a new user account linked to an existing profile so that the new user can log in and access the system.

## Business Value
- Enables user admins to onboard system users after a profile has been created.
- Prevents duplicate usernames through backend uniqueness checks.
- Ensures each account is linked to an existing user profile.

## Acceptance Criteria
1. The system shall allow a user admin to select an existing profile from a dropdown and enter username, password, and role on the create account page.
2. The system shall allow only users with role `User admin` to access the create account form.
3. The boundary shall validate that a profile, username, password, and role are provided before sending the request.
4. The system shall check whether the username already exists before saving the account.
5. The system shall verify that the referenced profile exists.
6. The system shall create the account when the input is valid, the username is unique, and the profile exists.
7. The system shall persist the linked profile email into `user_account` together with the account data.
8. The system shall display a success message after the account is created.
9. The system shall display an error message when any field is missing or invalid.
10. The system shall display an error message when the username already exists, the profile is not found, or the backend is unavailable.

## Scope
Included:
- Create account form rendering
- User admin access check in the boundary
- Client-side input validation
- Username uniqueness check
- Profile existence check
- Account data persistence
- Success and failure message handling

Excluded:
- User profile creation
- Account editing
- Account deletion
- Password reset
- Full authorization enforcement in the backend
