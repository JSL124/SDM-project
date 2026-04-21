# User Story: Create User Profile

## Story ID
US-PROFILE-01

## Title
Create User Profile

## User Story
As a User Admin, I want to create a new user profile by entering a role and description so that the system can store available profile types.

## Business Value
- Enables user admins to define profile roles used by the platform.
- Centralises profile role descriptions for account management.
- Keeps profile creation aligned with the BCE CreateProfile flow.

## Acceptance Criteria
1. The system shall allow a user admin to enter a role and description on the create profile page.
2. The system shall validate that both fields are provided before sending the request.
3. The system shall call `CreateProfileController.createProfile(role, description)`.
4. The system shall persist the profile through `UserProfile.createProfile(role, description)`.
5. The system shall display a success message when a `UserProfile` is returned.
6. The system shall display an error message when profile creation returns `null`.
7. The system shall display an error message when the backend service is unavailable.

## Scope
Included:
- Create profile form rendering
- Client-side input validation
- HTTP API route invocation
- Profile controller invocation
- Profile data persistence
- Success and failure message handling

Excluded:
- Profile editing
- Profile deletion
- Profile search or listing
- User authentication or session management
