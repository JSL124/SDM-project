# Wireframe: Create Fundraising Activity

## Screen Name
Create Fundraising Activity Page

## Purpose
Allow a fundraiser to enter fundraising activity details, validate them in the boundary, submit the form, or cancel the creation flow.

## Main UI Elements
- Page title: `Create Fundraising Activity`
- Introductory helper text
- Title input field
- Description textarea
- Target Amount (`$`) number input
- Category input field
- Start Date input
- End Date input
- Validation or error message area
- `Cancel` button
- `Create` button
- Success confirmation state
- Access denied state for non-Fundraiser users

## Text Wireframe
```text
+------------------------------------------------------------+
|                Create Fundraising Activity                 |
|------------------------------------------------------------|
| Fill in the details for the new fundraising activity       |
|                                                            |
| Title                                                      |
| [________________________________________________________] |
|                                                            |
| Description                                                |
| [________________________________________________________] |
| [________________________________________________________] |
|                                                            |
| Target Amount ($)                                          |
| [________________________________________________________] |
|                                                            |
| Category                                                   |
| [________________________________________________________] |
|                                                            |
| Start Date                                                 |
| [________________________________________________________] |
|                                                            |
| End Date                                                   |
| [________________________________________________________] |
|                                                            |
| Validation or error message appears here                   |
|                                                            |
| [   Cancel   ]                         [    Create    ]    |
+------------------------------------------------------------+
```

## Success State
- A success card replaces the form after a successful creation.
- The message `Fundraising activity created successfully.` is shown.
- The page redirects the fundraiser to the manage activities page after the success transition.

## Access Denied State
- If the stored role is not `Fundraiser`, the page shows `Access Denied`.
- The create fundraising activity form is not rendered.

## Boundary Responsibilities Reflected in the Wireframe
- Collect title, description, target amount, category, start date, and end date
- Validate inputs before making the backend call
- Show validation errors in the message area
- Submit valid input to the backend
- Navigate away when Cancel is selected
