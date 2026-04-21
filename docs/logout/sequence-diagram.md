# Sequence Diagram: Profile Logout

```mermaid
sequenceDiagram
    actor UserProfile as Logged-in profile
    participant LogoutPage as Boundary: LogoutPage

    Note over UserProfile,LogoutPage: This logout flow is shared by every logged-in profile type.

    UserProfile->>LogoutPage: Select logout option
    LogoutPage->>LogoutPage: logout()
    LogoutPage-->>UserProfile: Display login page
```

## Design Notes
- The implemented boundary helper lives at `frontend/src/feature/logout/boundary/LogoutPage.ts`.
- `LogoutPage.logout()` is modeled as `void` in code to match the current class diagram.
- No backend route, controller, entity, or database call participates in the current logout sequence.
