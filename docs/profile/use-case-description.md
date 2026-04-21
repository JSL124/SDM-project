# Use Case Description: Create User Profile

## Taiga ID
#1

## Name
Create User Profile

## Description
This use case allows the User Admin to create a new user profile by entering a role and description into the system.

## Trigger
The User Admin selects the "Create User Profile" option from the system interface.

## Actor(s)
- User Admin

## Preconditions
- The User Admin needs to be logged in.
- The User Admin needs to have permission to manage users.

## Normal Flow
1. The User Admin enters the profile role and description.
2. The User Admin clicks the Create button.
3. The system sends `role` and `description` to the CreateProfile controller.
4. The controller asks the UserProfile entity to create the profile.
5. The system displays a success message when a `UserProfile` is returned.

## Alternative Flow

### 5a. Profile creation fails
- The UserProfile entity returns `null`.
- The system displays an error message.
