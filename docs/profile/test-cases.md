# Test Cases: Create User Profile

## TC-PROFILE-01
Name: Successful profile creation with valid input

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid role.
2. Enter a valid description.
3. Click the Create button.

Expected Result:
- The backend returns a `UserProfile`.
- The boundary calls `displaySuccess()`.
- The boundary displays a success message confirming that the user profile has been created.

## TC-PROFILE-02
Name: Profile creation fails when role is empty

Preconditions:
- Create profile page is open

Steps:
1. Leave the role field empty.
2. Enter a valid description.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a role.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-03
Name: Profile creation fails when description is empty

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid role.
2. Leave the description field empty.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a description.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-04
Name: Profile creation fails when backend returns null

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid role.
2. Enter a valid description.
3. Click the Create button.

Expected Result:
- The backend returns `null`.
- The boundary calls `displayError()`.
- The message `Failed to create profile.` is shown.

## TC-PROFILE-05
Name: Profile creation fails when backend service is unavailable

Preconditions:
- Create profile page is open
- Backend service is stopped or unreachable

Steps:
1. Enter a valid role.
2. Enter a valid description.
3. Click the Create button.

Expected Result:
- The boundary catches the request failure.
- The boundary calls `displayError()`.
- The message `Unable to connect to server.` is shown.

## TC-PROFILE-06
Name: No message is displayed before submit

Preconditions:
- Create profile page is open

Steps:
1. Open the create profile page.
2. Do not click the Create button.

Expected Result:
- No success or error message is shown.
