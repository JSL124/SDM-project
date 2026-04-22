# Wireframe: Create User Account

## Screen Name
Create Account Page

## Purpose
Allow a user admin to select an existing profile and enter account details, then submit the account for creation.

## Main UI Elements
- Page title: `Create User Account`
- Profile dropdown populated from existing profiles
- Username input field
- Password input field
- Role select field
- Create button
- Status or error message area
- Access denied state for non-`User admin` users

## Text Wireframe
```text
+--------------------------------------------------+
|               Create User Account                |
|--------------------------------------------------|
| Profile                                          |
| [ Select a profile                            v ]|
|                                                  |
| Username                                         |
| [______________________________________________] |
|                                                  |
| Password                                         |
| [______________________________________________] |
|                                                  |
| Role                                             |
| [ Select a role                               v ]|
|                                                  |
| [              Create Button                   ] |
|                                                  |
| Error or success message appears here            |
+--------------------------------------------------+
```

## Boundary Responsibilities Reflected in the Wireframe
- Collect the selected profile, username, password, and role input
- Validate that all fields are filled before backend call
- Show error messages in the status area
- Show success feedback when the account is created
- Restrict the page to `User admin` in the current boundary implementation
