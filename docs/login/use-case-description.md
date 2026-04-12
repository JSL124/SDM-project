# Use Case Description: Fundraiser Login

## Taiga ID
#18

## Name
Fundraiser Login

## Description
This use case describes how a fundraiser logs into the system to access and manage fundraising activities.

## Trigger
The fundraiser selects the login option and submits the login form with an email address and password.

## Actor(s)
- Fundraiser

## Preconditions
- The fundraiser has a registered account in the system.
- The system is available and running.
- The fundraiser is on the login page.

## Normal Flow
1. The fundraiser enters an email and password on the login page.
2. The fundraiser submits the login credentials.
3. Before submit, `LoginPage` does not display any success or error message.
4. `LoginPage` validates that the fields are not empty and that the email format is valid.
5. `LoginPage` sends the credentials to `LoginController.login(email, password)`.
6. `LoginController` requests account data by calling `UserAccount.findAccountByEmail(email)`.
7. `UserAccount` retrieves the matching account record from PostgreSQL.
8. `LoginController` calls `UserAccount.verifyPassword(password)`.
9. `UserAccount` confirms that the provided password matches the stored password hash.
10. `LoginController` returns a successful result and success message to the boundary.
11. `LoginPage` displays the dashboard.

## Alternative Flow A1: Empty Email
1. The fundraiser submits the form without entering an email.
2. `LoginPage` rejects the submission during validation.
3. `LoginPage` displays the message `Please enter your email.`
4. The flow ends.

## Alternative Flow A2: Invalid Email Format
1. The fundraiser enters an incorrectly formatted email address.
2. `LoginPage` rejects the submission during validation.
3. `LoginPage` displays the message `Please enter a valid email address.`
4. The flow ends.

## Alternative Flow A3: Empty Password
1. The fundraiser submits the form without entering a password.
2. `LoginPage` rejects the submission during validation.
3. `LoginPage` displays the message `Please enter your password.`
4. The flow ends.

## Alternative Flow A4: Account Does Not Exist
1. `LoginController` cannot find an account associated with the entered email.
2. `LoginController` returns a failure result with the message `Account does not exist.`
3. `LoginPage` displays the message `Account does not exist.`
4. The flow ends.

## Alternative Flow A5: Invalid Password
1. `LoginController` finds the account but `UserAccount.verifyPassword(password)` returns `false`.
2. `LoginController` returns a failure result with the message `Invalid password.`
3. `LoginPage` displays the message `Invalid password.`
4. The flow ends.

## Alternative Flow A6: Backend Unavailable
1. `LoginPage` attempts to call the backend login endpoint.
2. The request fails because the backend or database is unavailable, or the backend returns a server error.
3. `LoginPage` displays the message `Unable to connect to server.`
4. The flow ends.
