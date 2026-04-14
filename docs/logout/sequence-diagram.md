# Sequence Diagram: Multi-Actor Logout

```mermaid
sequenceDiagram
    actor User as Fundraiser / Donee / User admin / Platform manager
    participant LogoutPage as Boundary: LogoutPage
    participant LogoutController as Controller: LogoutController

    Note over User,LogoutController: This logout flow is shared by Fundraiser, Donee, User admin, and Platform manager.

    User->>LogoutPage: Select logout option
    LogoutPage->>LogoutController: logout()
    LogoutController-->>LogoutPage: return
    LogoutPage-->>User: Display login page
```

## Design Notes
- The implemented boundary helper lives at `frontend/src/feature/logout/boundary/LogoutPage.ts`.
- `LogoutController.logout()` is modeled as `void` in code to match the current class diagram; the HTTP route always returns `{ success: true }` after invoking the controller.
- `displayLoginPage()` remains a boundary-side transition that clears local UI state after the logout request completes.
