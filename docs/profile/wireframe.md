# Wireframe: Create User Profile

## Screen Name
Create Profile Page

## Purpose
Allow a user admin to enter a new user's personal details and submit the profile for creation.

## Main UI Elements
- Page title: `Create User Profile`
- Name input field
- Email input field
- Phone Number input field
- Address input field
- Create button
- Status or error message area

## Text Wireframe
```text
+--------------------------------------------------+
|              Create User Profile                  |
|--------------------------------------------------|
| Name                                             |
| [______________________________________________] |
|                                                  |
| Email                                            |
| [______________________________________________] |
|                                                  |
| Phone Number                                     |
| [______________________________________________] |
|                                                  |
| Address                                          |
| [______________________________________________] |
|                                                  |
| [              Create Button                   ] |
|                                                  |
| Error or success message appears here            |
+--------------------------------------------------+
```

## Boundary Responsibilities Reflected in the Wireframe
- Collect name, email, phone number, and address input
- Validate that all fields are filled and email format is valid before backend call
- Show error messages in the status area
- Show success feedback when the profile is created
