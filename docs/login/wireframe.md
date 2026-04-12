# Wireframe: Fundraiser Login

## Screen Name
Login Page

## Purpose
Allow a fundraiser to enter credentials and attempt login.

## Main UI Elements
- Page title: `Log In`
- Email input field
- Password input field
- Submit button
- Status or error message area

## Text Wireframe
```text
+--------------------------------------------------+
|                     Log In                       |
|--------------------------------------------------|
| Email                                            |
| [______________________________________________] |
|                                                  |
| Password                                         |
| [______________________________________________] |
|                                                  |
| [                Log In Button                 ] |
|                                                  |
| Error or success message appears here            |
+--------------------------------------------------+
```

## Boundary Responsibilities Reflected in the Wireframe
- Collect email and password input
- Validate empty values and email format before backend call
- Show error messages in the status area
- Show success feedback and redirect to the dashboard
