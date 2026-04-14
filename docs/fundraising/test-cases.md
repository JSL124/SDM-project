# Test Cases: Create Fundraising Activity

## TC-FUNDRAISING-01
Name: Successful fundraising activity creation with valid input

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`
- Backend save operation succeeds

Steps:
1. Enter a valid title.
2. Enter a valid description.
3. Enter a target amount greater than zero.
4. Enter a category.
5. Enter a valid start date.
6. Enter a valid end date after the start date.
7. Click the Create button.

Expected Result:
- The backend returns success.
- The boundary displays a success message confirming that the fundraising activity was created.

## TC-FUNDRAISING-02
Name: Create fundraising activity page is denied for non-Fundraiser

Preconditions:
- Current user role is not `Fundraiser`

Steps:
1. Open the create fundraising activity page.

Expected Result:
- The boundary displays `Access Denied`.
- The activity creation form is not shown.

## TC-FUNDRAISING-03
Name: Activity creation fails when title is empty

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Leave the title field empty.
2. Enter valid values for the remaining fields.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a title.` is shown.
- No validation message is shown before the form is submitted.

## TC-FUNDRAISING-04
Name: Activity creation fails when description is empty

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Enter a valid title.
2. Leave the description field empty.
3. Enter valid values for the remaining fields.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a description.` is shown.
- No validation message is shown before the form is submitted.

## TC-FUNDRAISING-05
Name: Activity creation fails when target amount is empty or invalid

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Enter valid title, description, category, start date, and end date.
2. Leave the target amount empty, or enter `0` or a negative value.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a target amount greater than zero.` is shown.
- No validation message is shown before the form is submitted.

## TC-FUNDRAISING-06
Name: Activity creation fails when category is empty

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Enter valid title, description, target amount, start date, and end date.
2. Leave the category field empty.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a category.` is shown.
- No validation message is shown before the form is submitted.

## TC-FUNDRAISING-07
Name: Activity creation fails when start date is empty

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Enter valid title, description, target amount, category, and end date.
2. Leave the start date field empty.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter a start date.` is shown.
- No validation message is shown before the form is submitted.

## TC-FUNDRAISING-08
Name: Activity creation fails when end date is empty

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Enter valid title, description, target amount, category, and start date.
2. Leave the end date field empty.
3. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `Please enter an end date.` is shown.
- No validation message is shown before the form is submitted.

## TC-FUNDRAISING-09
Name: Activity creation fails when end date is on or before start date

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Enter valid title, description, target amount, and category.
2. Enter a start date.
3. Enter an end date equal to or earlier than the start date.
4. Click the Create button.

Expected Result:
- The boundary blocks submission.
- The message `End date must be after start date.` is shown.
- No backend request is made.

## TC-FUNDRAISING-10
Name: Activity creation fails when backend service is unavailable

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`
- Backend service is stopped or unreachable

Steps:
1. Enter valid fundraising activity details.
2. Click the Create button.

Expected Result:
- The boundary catches the request failure.
- The message `Unable to connect to server.` is shown.

## TC-FUNDRAISING-11
Name: No message is displayed before submit

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Open the create fundraising activity page.
2. Do not click the Create button.

Expected Result:
- No success or error message is shown.

## TC-FUNDRAISING-12
Name: Cancel returns the fundraiser to the manage activities page

Preconditions:
- Create fundraising activity page is open
- Current user role is `Fundraiser`

Steps:
1. Click the Cancel button.

Expected Result:
- The boundary closes the form flow.
- The fundraiser is returned to `/fundraiser/manage-activities`.
