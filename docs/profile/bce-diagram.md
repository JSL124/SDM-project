# BCE Diagram: Create User Profile

```mermaid
classDiagram
    class CreateProfilePage {
        <<Boundary>>
        +submitProfile(name: String, email: String, phoneNum: String, address: String) void
        +validateInput(name: String, email: String, phoneNum: String, address: String) boolean
        +displaySuccess() void
        +displayError(message: String) void
    }

    class ProfileController {
        <<Controller>>
        +createProfile(name: String, email: String, phoneNum: String, address: String) boolean
    }

    class UserProfile {
        <<Entity>>
        -profileId: String
        -name: String
        -email: String
        -phoneNum: String
        -address: String
        +existsByEmail(email: String) boolean
        +saveProfile(name: String, email: String, phoneNum: String, address: String) boolean
    }

    CreateProfilePage --> ProfileController
    ProfileController --> UserProfile
```

## BCE Role Mapping
- Boundary: Next.js create profile page component at `frontend/src/feature/profile/boundary/CreateProfilePage.tsx` that gathers input, validates user input, and shows success or error feedback.
- HTTP API route: Express route adapter at `backend/src/routes/profileRoutes.ts` that maps the HTTP request to the controller and returns the controller result.
- Controller: TypeScript profile controller class at `backend/src/profile/controller/ProfileController.ts` that coordinates the create profile use case.
- Entity: TypeScript user profile entity class at `backend/src/profile/entity/UserProfile.ts` that represents persisted profile data and handles email uniqueness checks and profile saving.
- Database: PostgreSQL `user_profile` table used by the entity layer.
- Boundary rule: No success or error message is displayed before the User Admin submits the create profile form.
