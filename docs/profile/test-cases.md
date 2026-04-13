# Test Cases: Create User Profile

## TC-PROFILE-01
Name: Successful profile creation with valid input

Preconditions:
- Create profile page is open
- Email does not already exist in `user_profile`

Steps:
1. Enter a valid name.
2. Enter a valid email.
3. Enter a valid phone number.
4. Enter a valid address.
5. Click the Create button.

Expected Result:
- The backend returns success.
- The boundary displays a success message confirming that the user profile has been created.

## TC-PROFILE-02
Name: Profile creation fails when name is empty

Preconditions:
- Create profile page is open

Steps:
1. Leave the name field empty.
2. Enter a valid email, phone number, and address.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a name.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-03
Name: Profile creation fails when email is empty

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid name.
2. Leave the email field empty.
3. Enter a valid phone number and address.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter an email.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-04
Name: Profile creation fails when email format is invalid

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid name.
2. Enter an invalid email format such as `user-at-mail.com`.
3. Enter a valid phone number and address.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a valid email address.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-05
Name: Profile creation fails when phone number is empty

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid name and email.
2. Leave the phone number field empty.
3. Enter a valid address.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a phone number.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-06
Name: Profile creation fails when address is empty

Preconditions:
- Create profile page is open

Steps:
1. Enter a valid name, email, and phone number.
2. Leave the address field empty.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter an address.` is shown.
- No validation message is shown before the form is submitted.

## TC-PROFILE-07
Name: Profile creation fails when email already exists

Preconditions:
- A profile with the same email already exists in `user_profile`

Steps:
1. Enter a valid name.
2. Enter an email that already exists.
3. Enter a valid phone number and address.
4. Click the Create button.

Expected Result:
- The controller detects the duplicate email.
- The boundary shows `Email already exists.`

## TC-PROFILE-08
Name: Profile creation fails when backend service is unavailable

Preconditions:
- Create profile page is open
- Backend service is stopped or unreachable

Steps:
1. Enter valid name, email, phone number, and address.
2. Click the Create button.

Expected Result:
- The boundary catches the request failure.
- The message `Unable to connect to server.` is shown.

## TC-PROFILE-09
Name: No message is displayed before submit

Preconditions:
- Create profile page is open

Steps:
1. Open the create profile page.
2. Do not click the Create button.

Expected Result:
- No success or error message is shown.
