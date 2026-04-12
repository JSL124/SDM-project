# AGENT.md - Coding Guidelines for CSIT314 Project

## 1. Core Principle

All code MUST strictly follow the design artifacts:

- User Story
- Use Case
- Wireframe
- BCE Diagram
- Sequence Diagram
- Class Diagram

There must be 100% consistency between design and code:

- Method names must match exactly
- Parameter names must match exactly
- Return types must match exactly
- Field names must match exactly

If a diagram says `create(name): boolean`, then code MUST have method name `create`, accept parameter `name`, and return `boolean`. If return type is `void`, DO NOT return anything.

`Promise<T>` wrappers are acceptable for async operations, but the underlying type must still match the diagram (e.g., diagram says `boolean` -> code returns `Promise<boolean>`).

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Boundary (Frontend) | Next.js + TypeScript + Tailwind CSS |
| Controller (Backend) | Node.js + TypeScript classes |
| Entity (Backend) | TypeScript classes + raw SQL |
| Database | PostgreSQL |
| DB Access | `pg` library (direct SQL, NO ORM) |
| Testing | Jest + ts-jest |
| CI/CD | GitHub Actions |

Next.js MUST NOT be used as a fullstack framework. Frontend and backend are separate applications.

## 3. BCE Architecture (MANDATORY)

This project MUST strictly follow BCE (Boundary-Control-Entity) architecture.

### Boundary (Frontend - Next.js)

Responsible for:

- UI rendering
- Capturing user input
- Input validation (empty fields, format, type)
- Displaying success/error messages

Boundary MUST NOT:

- Access database
- Contain business logic
- Call Entity directly
- Perform data persistence
- Contain SQL, DB connection, or repository access

Boundary MUST:

- Call Controller via HTTP API only
- Handle form input validation before sending to Controller
- Display errors passed up from Controller/Entity

### Controller (Backend - Node.js/TypeScript)

Responsible for:

- Handling one specific use case (one controller per use case)
- Managing application flow
- Coordinating between Boundary and Entity

Controller MUST:

- Be a TypeScript class
- Call Entity for all data operations
- Return results back to the route/boundary

Controller MUST NOT:

- Handle UI or display messages
- Directly manage database logic or SQL
- Access the `pg` library or database connection
- Call Boundary back

### Entity (Backend - Node.js/TypeScript)

Responsible for:

- Data modeling
- Database interaction (CRUD) via `pg` raw SQL
- Persistence logic
- Data-layer error handling (DB connection errors, query failures)

Entity MUST:

- Be a TypeScript class
- Use `pg` for direct SQL queries (NO ORM)
- Encapsulate all database access

Entity MUST NOT:

- Display UI or handle HTTP request/response
- Contain alert, popup, or display message logic
- Contain frontend logic

## 4. Communication Rules (MANDATORY)

These rules MUST NEVER be violated:

```
Boundary -> HTTP API -> Controller -> Entity -> PostgreSQL
```

- Only Boundary interacts with the user/actor directly
- Boundary calls Controller only (via HTTP API)
- Controller calls Entity only
- Entity calls Database only
- Errors flow back: Entity -> Controller -> Boundary (Boundary displays)
- Boundary MUST NOT call another Boundary
- Controller MUST NOT call Boundary directly

## 5. System Architecture

```text
[ Next.js (Boundary) ]  -- port 3000
        ↓ HTTP API
[ Express + TypeScript Controller ]  -- port 8080
        ↓
[ TypeScript Entity ]
        ↓ pg raw SQL
[ PostgreSQL ]
```

## 6. Validation Placement

| Validation Type | Layer | Examples |
|---|---|---|
| Form input validation | Boundary | Empty fields, email format, min length |
| Business rule validation | Controller | Authorization, workflow logic |
| Data-layer validation | Entity/DB | Unique constraints, FK violations, connection errors |

If user input has a problem, Boundary rejects it immediately before calling Controller.
If Entity detects an error, it passes it up through Controller to Boundary for display.

## 7. OO Design Rules

- Controller and Entity MUST be TypeScript classes (use `class` keyword)
- Methods belong in the class they logically relate to
- Do NOT create unnecessary "Action classes" -- place behavior in the domain/use-case class
  - Prefer `UserAccount.findAccountByEmail()` over a separate `FindAccountAction` class
- Each use case gets its own dedicated Controller class
  - `LoginController` handles login only
  - `CreateFRACategoryController` handles category creation only
  - Do NOT make one giant controller for multiple use cases

## 8. Landing Page Rules

The public landing page is a Boundary-only page and does NOT need a user story.

The landing page MAY:

- Render UI
- Display static text, media, and animations
- Handle simple frontend interactions (scrolling, transitions)

The landing page MUST NOT:

- Access database
- Contain business logic
- Call Entity directly

The first visible screen MUST show: `Online Fundraiser Platform`

After scrolling, the page MUST display a short description of the platform.

## 9. Feature Scope

### User Admin
- User profile: create / view / update / suspend / search
- User account: view / update / suspend / search

### Fundraiser (FR)
- Fundraising activity CRUDS management
- Track number of views and number of shortlisted/saved counts for own FSAs
- Search/view completed FSA history (with service and date filters)

### Donee
- Fundraising activity: search / view / save to favourite list
- Search/view within favourite list
- Donation history and FSA progress: search/view (with category and date filters)

### Platform Management
- FRA category CRUDS
- Daily / weekly / monthly report generation

## 10. Count Logic

When a donee views a fundraising activity:
- View count increments (tracked in Entity/DB)

When a donee saves a fundraising activity to favourites:
- Shortlist/save count increments (tracked in Entity/DB)

These counts MUST be visible to the Fundraiser who owns the activity.

## 11. Test Data Requirements

- Each entity type needs approximately 100 records of test data
- Seed scripts go in `backend/sql/` directory
- Scripts may use random generation
- Final demo MUST use this test data for live demonstration

## 12. TDD Requirements (MANDATORY)

Use Test-Driven Development:

- Write test cases BEFORE implementation
- Use Jest + ts-jest for backend testing
- Include test scenarios for:
  - Valid input (success path)
  - Invalid input
  - Missing/empty fields
  - Duplicate cases
  - Not found cases
  - Server/connection error cases
- Test plan, test cases, unit test cases, and test data must be documented
- Controller and Entity must be testable independently (separated from HTTP layer)

## 13. CI/CD Requirements

- Every feature MUST be testable
- Tests MUST run automatically via GitHub Actions
- At least one feature must demonstrate full dev-to-deploy CI/CD flow
- Code must be structured for CI integration

## 14. Development Process (MANDATORY)

Per user story, follow this order:

1. Define Wireframe (UI fields)
2. Define Use Case
3. Define BCE Diagram
4. Define Sequence Diagram
5. Define Class Diagram
6. Write Test Cases FIRST (TDD)
7. Implement:
   - Boundary (Next.js)
   - Controller (TypeScript class)
   - Entity (TypeScript class + SQL)
8. Run tests
9. Verify consistency with all diagrams

Implement ONE user story at a time. Fully complete (design + frontend + backend + tests) before moving to next.

## 15. Naming & Consistency Rules

- Do NOT rename anything between design and code
- No variations like `userId` vs `user_id` vs `UserID`
- Use exactly one format everywhere
- The following MUST all use identical names:
  - Wireframe input field names
  - Boundary method parameters
  - Controller method signatures
  - Entity method signatures
  - Sequence diagram message names
  - Class diagram method names
  - Actual code method names and return types

## 16. Agile / Sprint Approach

- Development follows sprint-based agile methodology
- 3-5 sprints expected, each producing a working increment
- Do NOT follow a pure waterfall (analysis -> design -> implementation) approach
- Use backlog and task management (Taiga or similar)

## 17. Backend Project Structure

```
backend/
  package.json
  tsconfig.json
  .env.example
  src/
    index.ts              # Express entry point (port 8080)
    db.ts                 # pg Pool + query helper
    controller/           # One class per use case
    entity/               # One class per domain object
    routes/               # Express routers (thin HTTP adapters)
  test/
    controller/           # Jest tests for controllers
    entity/               # Jest tests for entities
  sql/
    001-create-tables.sql
    002-seed-test-data.sql
```

Routes are thin HTTP adapters, NOT a BCE layer. They only map HTTP requests to Controller method calls.

## 18. Simplicity Rule

- Prefer simple TypeScript classes over complex frameworks
- NO ORM -- use `pg` with raw SQL only
- Avoid unnecessary abstraction
- Follow OO design strictly
- Do NOT build entire system at once
- Do NOT mix multiple user stories in one implementation

## 19. Critical Warning

Any violation of:

- BCE separation
- Design-code consistency
- Communication rules (Boundary->Controller->Entity->DB)
- TDD workflow

is considered a project rule violation and MUST be corrected before the implementation is accepted.
