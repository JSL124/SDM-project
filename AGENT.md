# AGENT.md - Repository-Wide Coding Guidelines

## 1. Purpose

This file defines repository-wide rules that apply to every feature.

For feature-specific work, check whether a dedicated guide exists under `docs/<feature>/AGENT.md`.

- Login-related work MUST follow `docs/login/AGENT.md`
- Create account related work MUST follow `docs/account/AGENT.md`
- Future feature-specific guides SHOULD follow the same pattern: `docs/<feature>/AGENT.md`
- If a feature-specific guide adds detail for that feature, follow the root `AGENT.md` for shared rules and the feature guide for feature-specific rules

## 2. Core Principle

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

`Promise<T>` wrappers are acceptable for async operations, but the underlying type must still match the diagram (for example, diagram says `boolean` so code may return `Promise<boolean>`).

## 3. Tech Stack

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

## 4. BCE Architecture (MANDATORY)

This project MUST strictly follow BCE (Boundary-Control-Entity) architecture.

### Boundary (Frontend - Next.js)

Responsible for:

- UI rendering
- Capturing user input
- Input validation (empty fields, format, type)
- Displaying success or error messages

Boundary MUST NOT:

- Access database
- Contain business logic
- Call Entity directly
- Perform data persistence
- Contain SQL, DB connection, or repository access

Boundary MUST:

- Call Controller via HTTP API only
- Handle form input validation before sending to Controller
- Display errors passed up from Controller or Entity

### Controller (Backend - Node.js/TypeScript)

Responsible for:

- Handling one specific use case
- Managing application flow
- Coordinating between Boundary and Entity

Controller MUST:

- Be a TypeScript class
- Call Entity for all data operations
- Return results back to the route or boundary

Controller MUST NOT:

- Handle UI or display messages
- Directly manage database logic or SQL
- Access the `pg` library or database connection
- Call Boundary back

### Entity (Backend - Node.js/TypeScript)

Responsible for:

- Data modeling
- Database interaction via `pg` raw SQL
- Persistence logic
- Data-layer error handling

Entity MUST:

- Be a TypeScript class
- Use `pg` for direct SQL queries
- Encapsulate all database access

Entity MUST NOT:

- Display UI or handle HTTP request or response
- Contain alert, popup, or display message logic
- Contain frontend logic

## 5. Communication Rules (MANDATORY)

These rules MUST NEVER be violated:

```text
Boundary -> HTTP API -> Controller -> Entity -> PostgreSQL
```

- Only Boundary interacts with the user directly
- Boundary calls Controller only, via HTTP API
- Controller calls Entity only
- Entity calls Database only
- Errors flow back: Entity -> Controller -> Boundary
- Boundary MUST NOT call another Boundary
- Controller MUST NOT call Boundary directly

## 6. Validation Placement

| Validation Type | Layer | Examples |
|---|---|---|
| Form input validation | Boundary | Empty fields, email format, min length |
| Business rule validation | Controller | Authorization, workflow logic |
| Data-layer validation | Entity/DB | Unique constraints, FK violations, connection errors |

If user input has a problem, Boundary rejects it immediately before calling Controller.
If Entity detects an error, it passes it up through Controller to Boundary for display.

## 7. OO Design Rules

- Controller and Entity MUST be TypeScript classes
- Methods belong in the class they logically relate to
- Do NOT create unnecessary action classes; place behavior in the domain or use-case class
- Each use case gets its own dedicated Controller class
- Do NOT make one giant controller for multiple use cases

## 8. TDD Requirements (MANDATORY)

Use Test-Driven Development:

- Write test cases BEFORE implementation
- Use Jest + ts-jest for backend testing
- Use Jest + React Testing Library for frontend Boundary testing
- Include test scenarios for:
  - Valid input
  - Invalid input
  - Missing or empty fields
  - Duplicate cases
  - Not found cases
  - Server or connection error cases
- Test plan, test cases, unit test cases, and test data must be documented
- Controller and Entity must be testable independently from the HTTP layer
- Boundary tests MUST verify validation, HTTP request behavior, and success or error display without calling Entity directly

## 9. CI/CD Requirements

- Every feature MUST be testable
- Tests MUST run automatically via GitHub Actions
- At least one feature must demonstrate full dev-to-deploy CI/CD flow
- Code must be structured for CI integration

## 10. Local Quality Gate (MANDATORY BEFORE PUSH)

Local pass is required before CI:

- Backend-only changes: `cd backend && npm test`
- Frontend-only changes: `cd frontend && npm run lint && npm test`
- Cross-layer feature changes: run the relevant backend and frontend validation commands before push

Development workflow MUST follow:

1. Write or update the failing test first
2. Implement the minimum code to pass
3. Refactor while keeping tests green
4. Push only after the relevant local quality gate passes

## 11. Development Process (MANDATORY)

Per user story, follow this order:

1. Define Wireframe
2. Define Use Case
3. Define BCE Diagram
4. Define Sequence Diagram
5. Define Class Diagram
6. Write Test Cases first
7. Implement Boundary, Controller, and Entity
8. Run tests
9. Verify consistency with all diagrams

Implement ONE user story at a time. Fully complete design, frontend, backend, and tests before moving to the next.

## 12. Naming and Consistency Rules

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

## 13. Simplicity Rule

- Prefer simple TypeScript classes over complex frameworks
- NO ORM; use `pg` with raw SQL only
- Avoid unnecessary abstraction
- Follow OO design strictly
- Do NOT build the entire system at once
- Do NOT mix multiple user stories in one implementation

## 14. Critical Warning

Any violation of:

- BCE separation
- Design-code consistency
- Communication rules
- TDD workflow

is considered a project rule violation and MUST be corrected before the implementation is accepted.
