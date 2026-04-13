# Use Case Description: Create User Profile

## Taiga ID
#1

## Name
Create User Profile

## Description
This use case allows the User Admin to create a new user profile by entering the user's personal details into the system.

## Trigger
The User Admin selects the "Create User Profile" option from the system interface.

## Actor(s)
- User Admin

## Preconditions
- The User Admin needs to be logged in.
- The User Admin needs to have permission to manage users.
- The user account does not already exist.

## Normal Flow
1. The User Admin enters the new user's personal information.
2. The User Admin clicks the Create button.
3. The system validates the entered profile details.
4. The system saves the new user profile.
5. The system displays a success message confirming that the user profile has been created.

## Alternative Flow

### 3a. Invalid or incomplete information entered
- The system detects invalid or missing input.
- The system displays an error message.

### 3b. Email already exists
- The system detects that the email is already in use.
- The system displays an error message.
