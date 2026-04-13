# Sequence Diagram: Create User Profile

```mermaid
sequenceDiagram
    actor UserAdmin as User Admin
    participant CreateProfilePage as Boundary: CreateProfilePage
    participant ProfileController as Controller: ProfileController
    participant UserProfile as Entity: UserProfile
    participant PostgreSQL as Database: PostgreSQL

    UserAdmin->>CreateProfilePage: Enter name, email, phoneNum, address
    UserAdmin->>CreateProfilePage: Click Create button
    CreateProfilePage->>CreateProfilePage: validateInput(name, email, phoneNum, address)
    Note over CreateProfilePage: No success or error message is displayed before submit

    alt Validation fails
        CreateProfilePage->>CreateProfilePage: displayError()
        CreateProfilePage-->>UserAdmin: Display validation error message
    else Validation succeeds
        CreateProfilePage->>ProfileController: createProfile(name, email, phoneNum, address)
        ProfileController->>UserProfile: existsByEmail(email)
        UserProfile->>PostgreSQL: SELECT from user_profile WHERE email = ?
        PostgreSQL-->>UserProfile: Result rows
        UserProfile-->>ProfileController: true or false

        alt Email exists
            ProfileController-->>CreateProfilePage: return false
            CreateProfilePage->>CreateProfilePage: displayError()
            CreateProfilePage-->>UserAdmin: Display "Email already exists."
        else Email not exists
            ProfileController->>UserProfile: saveProfile(name, email, phoneNum, address)
            UserProfile->>PostgreSQL: INSERT INTO user_profile
            PostgreSQL-->>UserProfile: Insert result
            UserProfile-->>ProfileController: true or false

            alt Save success
                ProfileController-->>CreateProfilePage: return true
                CreateProfilePage->>CreateProfilePage: displaySuccess()
                CreateProfilePage-->>UserAdmin: Display success message
            else Save fails
                ProfileController-->>CreateProfilePage: return false
                CreateProfilePage->>CreateProfilePage: displayError()
                CreateProfilePage-->>UserAdmin: Display error message
            end
        end
    end
```
