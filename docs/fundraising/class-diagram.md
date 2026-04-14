# Class Diagram: Create Fundraising Activity

```mermaid
classDiagram
    class CreateFundraisingActivityPage {
        +displayFundraisingActivityForm() void
        +submitFundraisingActivityForm() void
        +displayFundraisingActivityConfirmation() void
        +displayFundraisingActivityValidationError() void
        +closeFundraisingActivityForm() void
        +validateFundraisingActivity() boolean
    }

    class CreateFundraisingActivityController {
        +createFundraisingActivity(title: String, description: String, targetAmount: Decimal, category: String, startDate: Date, endDate: Date) boolean
        +cancelFundraisingActivityCreation() void
    }

    class FundraisingActivity {
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

    CreateFundraisingActivityPage --> CreateFundraisingActivityController : calls
    CreateFundraisingActivityController --> FundraisingActivity : uses
```

## Design Notes
- The class diagram follows the approved design intent where validation responsibility stays in the boundary and `validateFundraisingActivity(...)` returns `boolean`.
- The implemented controller currently uses async TypeScript methods and returns a result object rather than a raw `boolean`. The diagram still captures the intended success or failure decision point of the create flow.
- The implemented flow is reached through `POST /api/fundraising-activity` in `backend/src/routes/fundraisingRoutes.ts`.
- `FundraisingActivity.saveFundraisingActivity(...)` is implemented as a static async entity operation that inserts into PostgreSQL and reports whether the save succeeded.
