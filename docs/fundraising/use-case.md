# Use Case: Create Fundraising Activity

## Use Case ID
UC-FUNDRAISING-01

## Goal
Allow a fundraiser to create a new fundraising activity by entering valid activity details into the system.

## Primary Actor
Fundraiser

## Supporting Components
- `CreateFundraisingActivityPage` as the boundary at `frontend/src/feature/fundraising/boundary/CreateFundraisingActivityPage.tsx`
- `frontend/src/app/fundraiser/create-fundraising-activity/page.tsx` as the App Router page entry
- `POST /api/fundraising-activity` as the HTTP API route at `backend/src/routes/fundraisingRoutes.ts`
- `CreateFundraisingActivityController` as the controller at `backend/src/fundraising/controller/CreateFundraisingActivityController.ts`
- `FundraisingActivity` as the entity at `backend/src/fundraising/entity/FundraisingActivity.ts`
- `fundraising_activity` table in PostgreSQL

## Preconditions
- The fundraiser needs to be logged in.
- The fundraiser needs to have permission to create fundraising activities.
- The system needs to be available and running.

## Postconditions
Success:
- A new fundraising activity is saved in the system.
- A confirmation message is displayed to the fundraiser.

Failure:
- No fundraising activity is created.
- An appropriate validation or error message is displayed on the create fundraising activity page.

## Trigger
The fundraiser selects the "Create Fundraising Activity" option from the system interface.
