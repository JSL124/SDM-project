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
        +login(email: String, password: String) LoginResult
    }

    class UserAccount {
        -email: String
        -passwordHash: String
        +findAccountByEmail(email: String) UserAccount
        +verifyPassword(password: String) boolean
    }

    LoginPage --> LoginController : calls
    LoginController --> UserAccount : uses
```

## Design Notes
- The attribute `password` is refined to `passwordHash` because the persisted value in PostgreSQL must be a bcrypt hash, not a plain-text password.
- `UserAccountRepository` has been removed. The repository logic (`findAccountByEmail`) is a static method on the `UserAccount` entity class, following the BCE pattern where the Entity owns all DB access via `pg` raw SQL.
- `LoginController.login(email, password)` returns a distinguishable login result so the boundary can display `Account does not exist.` and `Invalid password.` exactly as required by the use case.
- Return types in code are `Promise<T>` due to async DB and bcrypt operations. The underlying type still matches the diagram intent.
- The implemented boundary component lives at `frontend/src/feature/login/boundary/LoginBoundary.tsx`.
