# Class Diagram: Fundraiser Login

```mermaid
classDiagram
    class LoginPage {
        +submitLogin(email: String, password: String) void
        +validateInput(email: String, password: String) boolean
        +displayLoginSuccess() void
        +displayError(message: String) void
    }

    class LoginController {
        +login(email: String, password: String) UserAccount | null
    }

    class UserAccount {
        -email: String
        -password: String
        +login(email: String, password: String) UserAccount | null
    }

    LoginPage --> LoginController : calls
    LoginController --> UserAccount : uses
```

## Design Notes
- `UserAccountRepository` has been removed. The login lookup and password check are handled by the static `UserAccount.login(email, password)` entity method, following the BCE pattern where the Entity owns all DB access via `pg` raw SQL.
- `LoginController.login(email, password)` returns `UserAccount | null`, so the boundary can branch on whether the returned account is null.
- Return types in code are `Promise<T>` due to async DB and bcrypt operations. The underlying type still matches the diagram intent.
- The implemented boundary component lives at `frontend/src/feature/login/boundary/LoginBoundary.tsx`.
