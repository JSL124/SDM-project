# Test Cases: Create User Account

## TC-ACCOUNT-01
Name: Successful account creation with valid input

Preconditions:
- Create account page is open
- Current user role is `User admin`
- Username does not already exist in `user_account`
- Referenced profile exists in `user_profile`

Steps:
1. Enter a valid profile ID.
2. Enter a unique username.
3. Enter a valid password.
4. Select a role.
5. Click the Create button.

Expected Result:
- The backend returns success.
- The boundary displays a success message confirming that the user account has been created.

## TC-ACCOUNT-02
Name: Create account page is denied for non-User admin

Preconditions:
- Current user role is not `User admin`

Steps:
1. Open the create account page.

Expected Result:
- The boundary displays `Access Denied`.
- The account creation form is not shown.

## TC-ACCOUNT-03
Name: Account creation fails when profile ID is empty

Preconditions:
- Create account page is open
- Current user role is `User admin`

Steps:
1. Leave the profile ID field empty.
2. Enter a valid username, password, and role.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a profile ID.` is shown.
- No validation message is shown before the form is submitted.

## TC-ACCOUNT-04
Name: Account creation fails when username is empty

Preconditions:
- Create account page is open
- Current user role is `User admin`

Steps:
1. Enter a valid profile ID.
2. Leave the username field empty.
3. Enter a valid password and role.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a username.` is shown.
- No validation message is shown before the form is submitted.

## TC-ACCOUNT-05
Name: Account creation fails when password is empty

Preconditions:
- Create account page is open
- Current user role is `User admin`

Steps:
1. Enter a valid profile ID and username.
2. Leave the password field empty.
3. Select a role.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a password.` is shown.
- No validation message is shown before the form is submitted.

## TC-ACCOUNT-06
Name: Account creation fails when role is not selected

Preconditions:
- Create account page is open
- Current user role is `User admin`

Steps:
1. Enter a valid profile ID, username, and password.
2. Do not select a role.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please select a role.` is shown.
- No validation message is shown before the form is submitted.

## TC-ACCOUNT-07
Name: Account creation fails when username already exists

Preconditions:
- A user account with the same username already exists in `user_account`

Steps:
1. Enter a valid profile ID.
2. Enter an existing username.
3. Enter a valid password.
4. Select a role.
5. Click the Create button.

Expected Result:
- The controller detects the duplicate username.
- The boundary shows `Username already exists.`

## TC-ACCOUNT-08
Name: Account creation fails when profile is not found

Preconditions:
- The entered profile ID does not exist in `user_profile`

Steps:
1. Enter a non-existing profile ID.
2. Enter a unique username.
3. Enter a valid password.
4. Select a role.
5. Click the Create button.

Expected Result:
- The controller detects that the profile does not exist.
- The boundary shows `Profile not found.`

## TC-ACCOUNT-09
Name: Account creation fails when backend service is unavailable

Preconditions:
- Create account page is open
- Current user role is `User admin`
- Backend service is stopped or unreachable

Steps:
1. Enter valid profile ID, username, password, and role.
2. Click the Create button.

Expected Result:
- The boundary catches the request failure.
- The message `Unable to connect to server.` is shown.

## TC-ACCOUNT-10
Name: No message is displayed before submit

Preconditions:
- Create account page is open
- Current user role is `User admin`

Steps:
1. Open the create account page.
2. Do not click the Create button.

Expected Result:
- No success or error message is shown.
