# Use Case Description: Create User Account

## Taiga ID
#6

## Name
Create User Account

## Description
This use case allows the user admin to create a new user account so that the new user can log in and access the system.

## Trigger
The User Admin selects the "Create User Account" option from the system interface.

## Actor(s)
- User Admin

## Preconditions
- The User Admin needs to be logged in.
- The User Admin needs to have permission to create user accounts.
- A corresponding user profile already exists.

## Normal Flow
1. The user admin selects an existing profile and enters the account information: username, password, and role.
2. The user admin clicks the Create button.
3. The system validates the entered account information.
4. The system checks whether the username already exists.
5. The system checks whether the selected profile exists.
6. The system creates and saves the new user account and links it to the selected user profile.
7. The system displays a success message confirming that the user account has been created.

## Alternative Flow 3a: Invalid account information entered
1. The system detects invalid or missing input.
2. The system displays an error message.
3. The user admin corrects the account details.
4. The flow resumes from Step 2.

## Alternative Flow 4a: Username already exists
1. The system detects that the username is already in use.
2. The system displays an error message.

## Alternative Flow 5a: Profile not found
1. The system detects that the selected profile does not exist.
2. The system displays an error message.
