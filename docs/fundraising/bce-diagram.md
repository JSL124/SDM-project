# BCE Diagram: Create Fundraising Activity

```mermaid
classDiagram
    class CreateFundraisingActivityPage {
        <<Boundary>>
        +displayFundraisingActivityForm() void
        +submitFundraisingActivityForm() void
        +displayFundraisingActivityConfirmation() void
        +displayFundraisingActivityValidationError() void
        +closeFundraisingActivityForm() void
        +validateFundraisingActivity() boolean
    }

    class CreateFundraisingActivityController {
        <<Controller>>
        +createFundraisingActivity(title: String, description: String, targetAmount: Decimal, category: String, startDate: Date, endDate: Date) boolean
        +cancelFundraisingActivityCreation() void
    }

    class FundraisingActivity {
        <<Entity>>
        -activityID: String
        -title: String
        -description: String
        -targetAmount: Decimal
        -category: String
        -startDate: Date
        -endDate: Date
        -status: String
        +saveFundraisingActivity() boolean
    }

    CreateFundraisingActivityPage --> CreateFundraisingActivityController
    CreateFundraisingActivityController --> FundraisingActivity
```

## BCE Role Mapping
- Boundary: Next.js create fundraising activity component at `frontend/src/feature/fundraising/boundary/CreateFundraisingActivityPage.tsx` that gathers form input, validates the data, displays validation feedback, displays confirmation feedback, and handles cancel navigation.
- Controller: TypeScript controller class at `backend/src/fundraising/controller/CreateFundraisingActivityController.ts` that coordinates the create activity use case and delegates persistence to the entity.
- Entity: TypeScript entity class at `backend/src/fundraising/entity/FundraisingActivity.ts` that represents persisted fundraising activity data and performs database save operations.
- Database: PostgreSQL `fundraising_activity` table used by the entity layer.

## Boundary Rules
- Validation occurs before the backend call.
- `validateFundraisingActivity(...)` returns `boolean`.
- Only a `Fundraiser` can access the create fundraising activity page in the current implementation.
