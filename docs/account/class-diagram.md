# Class Diagram: Create User Account

```mermaid
classDiagram
    class CreateAccountPage {
        +submitUserAccount(profileId: String, username: String, password: String, role: String) void
        +validateInput(profileId: String, username: String, password: String, role: String) boolean
        +displaySuccess() void
        +displayError() void
    }

    class CreateAccountController {
        +createAccount(profileId: String, username: String, password: String, role: String) boolean
        +validateInput(username: String, password: String) void
    }

    class UserAccount {
        -email: String
        -passwordHash: String
        -role: String
        +existsByUsername(username: String) boolean
        +saveAccount(profileId: String, email: String, username: String, password: String, role: String) boolean
    }

    class UserProfile {
        -profileId: String
        -name: String
        -email: String
        -phoneNum: String
        -address: String
        +findProfileById(profileId: String) userProfile
    }

    CreateAccountPage --> CreateAccountController : calls
    CreateAccountController --> UserAccount : uses
    CreateAccountController --> UserProfile : uses
```

## Design Notes
- The supplied BCE and sequence artifacts used different controller names. The docs are normalized to `CreateAccountController` to match the implemented code.
- `UserAccount.saveAccount(...)` stores the linked profile email together with the account because `user_account.email` is `NOT NULL` in the current schema.
- `CreateAccountController.createAccount(...)` returns a result object containing `success: boolean` and `message: string` so the route and boundary can distinguish duplicate username, missing profile, and generic save failures. The `success` field serves as the `boolean` return type specified in the diagram.
- Return types in code are `Promise<T>` due to async DB operations. The underlying type still matches the diagram intent.
- `displayError()` accepts a message parameter internally to show specific validation and backend error messages, while the diagram captures the public contract.
