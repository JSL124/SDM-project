# User Story: Create User Profile

## Story ID
US-PROFILE-01

## Title
Create User Profile

## User Story
As a User Admin, I want to create a new user profile by entering the user's personal details so that the user's information is stored in the system.

## Business Value
- Enables user admins to onboard new users into the platform.
- Centralises user profile data for management and reference.
- Prevents duplicate profiles by enforcing unique email addresses.

## Acceptance Criteria
1. The system shall allow a user admin to enter a name, email, phone number, and address on the create profile page.
2. The system shall validate that all fields are provided before sending the request.
3. The system shall validate that the email format is correct.
4. The system shall create the user profile when all fields are valid and the email does not already exist.
5. The system shall display a success message after the profile is created.
6. The system shall display an error message when any field is empty or invalid.
7. The system shall display an error message when the email already exists in the system.
8. The system shall display an error message when the backend service is unavailable.

## Scope
Included:
- Create profile form rendering
- Client-side input validation
- HTTP API route invocation
- Profile controller invocation
- Email uniqueness check in PostgreSQL
- Profile data persistence
- Success and failure message handling

Excluded:
- Profile editing
- Profile deletion
- Profile search or listing
- User authentication or session management
