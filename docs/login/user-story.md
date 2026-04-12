# User Story: Fundraiser Login

## Story ID
US-LOGIN-01

## Title
Fundraiser Login

## User Story
As a fundraiser, I want to log in with my registered email and password so that I can access and manage my fundraising activities securely.

## Business Value
- Restricts dashboard access to authenticated users only.
- Protects fundraiser data and operational features.
- Establishes the entry point for all fundraiser-specific use cases.

## Acceptance Criteria
1. The system shall allow a fundraiser to enter an email and password on the login page.
2. The system shall validate that both fields are provided before sending the request.
3. The system shall validate that the email format is correct.
4. The system shall authenticate the fundraiser when the email exists and the password is correct.
5. The system shall display the fundraiser dashboard after successful authentication.
6. The system shall display an error message when the account does not exist.
7. The system shall display an error message when the password is invalid.
8. The system shall display an error message when the backend service is unavailable.

## Scope
Included:
- Login form rendering
- Client-side input validation
- Login controller invocation
- Account lookup in PostgreSQL
- Password verification
- Success and failure message handling

Excluded:
- Registration
- Password reset
- Session timeout
- Multi-factor authentication
