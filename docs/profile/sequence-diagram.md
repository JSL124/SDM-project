# Sequence Diagram: Create User Profile

```mermaid
sequenceDiagram
    actor UserAdmin as User Admin
    participant CreateProfilePage as Boundary: CreateProfilePage
    participant ProfileRoute as HTTP API: POST /api/profile
    participant CreateProfileController as Controller: CreateProfileController
    participant UserProfile as Entity: UserProfile
    participant PostgreSQL as Database: PostgreSQL

    UserAdmin->>CreateProfilePage: Enter role, description
    UserAdmin->>CreateProfilePage: Click Create button
    CreateProfilePage->>ProfileRoute: POST /api/profile with role, description
    ProfileRoute->>CreateProfileController: createProfile(role: String, description: String)
    CreateProfileController->>UserProfile: createProfile(role: String, description: String)
    UserProfile->>PostgreSQL: INSERT INTO user_profile (role, description)
    PostgreSQL-->>UserProfile: Insert result
    UserProfile-->>CreateProfileController: return UserProfile
    CreateProfileController-->>ProfileRoute: return UserProfile
    ProfileRoute-->>CreateProfilePage: return UserProfile

    alt if Not Null
        CreateProfilePage->>CreateProfilePage: displaySuccess()
        CreateProfilePage-->>UserAdmin: Display success message
    else if Null
        CreateProfilePage->>CreateProfilePage: displayError()
        CreateProfilePage-->>UserAdmin: Display error message
    end
```
