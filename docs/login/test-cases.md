# Test Cases: Fundraiser Login

## TC-LOGIN-01
Name: Successful login with valid credentials

Preconditions:
- Account exists in `user_account`
- Account status is `ACTIVE`
- Password hash matches the provided password

Steps:
1. Open the login page.
2. Enter a valid email.
3. Enter the correct password.
4. Submit the form.

Expected Result:
- The backend returns success.
- The boundary displays success feedback.
- The user is redirected to the dashboard.

## TC-LOGIN-02
Name: Login fails when email is empty

Preconditions:
- Login page is open

Steps:
1. Leave the email field empty.
2. Enter any password.
3. Submit the form.

Expected Result:
- The boundary blocks submission.
- The message `Please enter your email.` is shown.
- No validation message is shown before the form is submitted.

## TC-LOGIN-03
Name: Login fails when email format is invalid

Preconditions:
- Login page is open

Steps:
1. Enter an invalid email format such as `fundraiser-at-mail.com`.
2. Enter any password.
3. Submit the form.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a valid email address.` is shown.
- No validation message is shown before the form is submitted.

## TC-LOGIN-04
Name: Login fails when password is empty

Preconditions:
- Login page is open

Steps:
1. Enter a valid email.
2. Leave the password field empty.
3. Submit the form.

Expected Result:
- The boundary blocks submission.
- The message `Please enter your password.` is shown.
- No validation message is shown before the form is submitted.

## TC-LOGIN-05
Name: Login fails when account does not exist

Preconditions:
- No account exists for the entered email

Steps:
1. Enter an unregistered email.
2. Enter any password.
3. Submit the form.

Expected Result:
- The controller returns `null`.
- The boundary shows the login error message.

## TC-LOGIN-06
Name: Login fails when password is incorrect

Preconditions:
- Account exists for the entered email
- Entered password does not match the stored hash

Steps:
1. Enter a registered email.
2. Enter an incorrect password.
3. Submit the form.

Expected Result:
- The controller returns `null`.
- The boundary shows the login error message.

## TC-LOGIN-07
Name: Login fails when backend service is unavailable

Preconditions:
- Login page is open
- Backend service is stopped or unreachable

Steps:
1. Enter a valid email.
2. Enter a valid password.
3. Submit the form.

Expected Result:
- The boundary catches the request failure.
- The message `Unable to connect to server.` is shown.

## TC-LOGIN-08
Name: No message is displayed before submit

Preconditions:
- Login page is open

Steps:
1. Open the login page.
2. Do not submit the form.

Expected Result:
- No success or error message is shown.
