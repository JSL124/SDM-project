# Use Case Description: Create Fundraising Activity

## Taiga ID
#13

## Name
Create Fundraising Activity

## Description
This use case describes how a fundraiser creates a fundraising activity in the system so that they can begin receiving support and donations for a cause.

## Trigger
The fundraiser selects the "Create Fundraising Activity" option on the system interface.

## Actor(s)
- Fundraiser

## Preconditions
- The fundraiser is logged into the system.
- The fundraiser has permission to create fundraising activities.
- The system is available and running.

## Normal Flow
1. The fundraiser navigates to the fundraising activity page.
2. The fundraiser clicks the "Create Fundraising Activity" button.
3. The system displays the fundraising activity creation form.
4. The fundraiser enters the required details.
5. The fundraiser clicks the Submit button.
6. The system validates the entered information.
7. The system saves the fundraising activity.
8. The system displays a confirmation message.

## Alternative Flow 3a: Cancel Creation
1. The fundraiser cancels the creation process.
2. The system closes the form and returns the fundraiser to the fundraising activity page.

## Alternative Flow 6a: Invalid Form Input
1. The fundraiser enters missing or invalid information.
2. The system detects the invalid input during validation.
3. The system displays validation errors and asks the fundraiser to correct them.
4. The use case resumes at Step 4 of the Normal Flow.
