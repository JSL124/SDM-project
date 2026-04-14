# User Story: Create Fundraising Activity

## Story ID
US-FUNDRAISING-01

## Title
Create Fundraising Activity

## User Story
As a fundraiser, I want to create a fundraising activity by entering the activity details so that I can begin receiving support and donations for a cause.

## Business Value
- Enables fundraisers to launch new fundraising campaigns in the platform.
- Ensures invalid activity details are blocked before the backend request is sent.
- Persists campaign information so it can be managed and displayed later.

## Acceptance Criteria
1. The system shall allow a fundraiser to open the create fundraising activity form.
2. The system shall allow only users with role `Fundraiser` to access the create fundraising activity page.
3. The boundary shall validate the entered title, description, target amount, category, start date, and end date before sending the request.
4. The boundary validation method `validateFundraisingActivity(...)` shall return `boolean`.
5. The system shall reject submission when any required field is empty.
6. The system shall reject submission when the target amount is less than or equal to zero.
7. The system shall reject submission when the end date is on or before the start date.
8. The system shall create the fundraising activity when all inputs are valid and the save operation succeeds.
9. The system shall display a confirmation message after successful creation.
10. The system shall display an error message when the input is invalid.
11. The system shall display an error message when the backend service is unavailable.
12. The system shall return the fundraiser to the fundraising activity page when Cancel is selected.

## Scope
Included:
- Create fundraising activity form rendering
- Fundraiser access check in the boundary
- Client-side input validation
- HTTP API route invocation
- Fundraising activity persistence
- Success and failure message handling
- Cancel flow back to the manage activities page

Excluded:
- Editing an activity
- Deleting an activity
- Donation processing
- Activity approval workflows
- Backend authorization enforcement beyond current route behavior
