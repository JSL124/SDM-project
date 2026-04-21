# Wireframe: Create User Profile

## Screen Name
Create Profile Page

## Purpose
Allow a User Admin to enter a profile role and description, then submit the profile for creation.

## Main UI Elements
- Page title: `Create User Profile`
- Role input field
- Description input field
- Create button
- Status or error message area

## Text Wireframe
```text
+--------------------------------------------------+
|              Create User Profile                 |
|--------------------------------------------------|
| Role                                             |
| [______________________________________________] |
|                                                  |
| Description                                      |
| [______________________________________________] |
| [______________________________________________] |
|                                                  |
| [                    Create                    ] |
|                                                  |
| Error or success message appears here            |
+--------------------------------------------------+
```

## Boundary Responsibilities Reflected in the Wireframe
- Collect role and description input
- Validate that both fields are filled before the backend call
- Show error messages in the status area
- Show success feedback when the profile is created
