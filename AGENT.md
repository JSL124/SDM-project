# AGENT.md - Coding Guidelines for CSIT314 Project

## 1. Core Principle

All code MUST strictly follow the design artifacts:

- Use Case
- Sequence Diagram
- BCE Diagram
- Class Diagram
- Wireframe

There must be 100% consistency between design and code:

- Method names must match exactly
- Parameter names must match exactly
- Return types must match exactly

## 2. Architecture (MANDATORY)

We use BCE (Boundary-Control-Entity) architecture.

### Boundary (Frontend - Next.js)

Responsible for:

- UI rendering
- Capturing user input
- Input validation (empty, format, type)
- Displaying success/error messages

Boundary MUST NOT:

- Access database
- Contain business logic
- Call Entity directly
- Perform data persistence

Boundary MUST:

- Call Controller via API only

## Landing Page Rules

The public landing page is treated as a Boundary-only page and does NOT need to be part of a user story.

### Purpose

The landing page is for presentation only:

- Introduce the platform
- Present the platform identity clearly
- Provide a polished first impression for users

### BCE Rule For Landing Page

The landing page MUST remain in the Boundary layer only.

The landing page MAY:

- Render UI
- Display static text, media, and animations
- Handle simple frontend interactions such as scrolling, transitions, and section changes

The landing page MUST NOT:

- Access the database
- Contain business logic
- Call Entity directly
- Perform persistence
- Contain backend workflow logic

If dynamic data is needed in the future, Boundary MUST call Controller via API only.

### Landing Page Content Rule

The first visible screen MUST show the title:

`Online Fundraiser Platform`

Before scrolling:

- The title must appear clearly in the center area of the landing page
- The page may include background media or visual effects

After scrolling:

- The page MUST display a short English explanation of the platform
- The explanation should describe the platform as a place for creating fundraising campaigns, sharing causes, and supporting donations online

Recommended default explanation:

`Our platform helps individuals and organizations create fundraising campaigns, share their stories, and connect with supporters through a simple and trustworthy online experience.`

`Users can discover meaningful causes, contribute securely, and track campaign progress in one place, making fundraising more transparent, accessible, and efficient.`

### Implementation Rule

The landing page may use reusable frontend animation or presentation components, including scroll-based hero sections, as long as BCE separation is not violated.

Demo-only behavior MUST NOT remain in the final landing page:

- No developer playground controls
- No template-switch buttons
- No component demo wording
- No placeholder text unrelated to the fundraiser platform

Landing page code should keep:

- display content separated from animation logic
- reusable presentation components where appropriate
- no backend dependency unless accessed through Controller API

### Control (Backend - Java)

Responsible for:

- Handling one specific user story (one controller per use case preferred)
- Managing application flow
- Coordinating between Boundary and Entity

Control MUST:

- Not handle UI
- Not directly manage database logic
- Call Entity for all data operations

### Entity (Backend - Java)

Responsible for:

- Data modeling
- Database interaction (CRUD)
- Persistence logic

Entity MUST:

- Not display UI
- Not handle request/response logic
- Not contain frontend logic

## 3. System Architecture

Frontend and Backend MUST be separated:

```text
[ Next.js (Boundary) ]
        ↓ HTTP API
[ Java Controller ]
        ↓
[ Entity / Database ]
```

Next.js MUST NOT be used as a fullstack framework.

## 4. Development Process (MANDATORY)

Development MUST follow this order per user story:

1. Define Wireframe (UI fields)
2. Define Use Case
3. Define BCE Diagram
4. Define Sequence Diagram
5. Write Test Cases FIRST (TDD)
6. Implement:
   - Boundary (Next.js)
   - Controller (Java)
   - Entity (Java)
7. Run tests
8. Verify consistency with diagrams

## 5. Naming & Consistency Rules

- Do NOT rename anything between design and code
- No variations like:
  - `userId` vs `user_id` vs `UserID` ❌
- Use exactly one format everywhere

## 6. Method Design Rules

If diagram says:

```text
create(name): boolean
```

Then code MUST:

- Have method name `create`
- Accept parameter `name`
- Return `boolean`

If return type is `void` -> DO NOT return anything.

## 7. Validation Rules

- All input validation MUST happen in Boundary
- Business validation happens in Controller
- Database validation handled in Entity

## 8. Testing (MANDATORY)

Use Test-Driven Development:

- Write test cases BEFORE implementation
- Include:
  - valid input
  - invalid input
  - missing fields
  - duplicate cases
  - not found cases

Use JUnit for backend testing.

## 9. CI/CD Requirements

- Every feature MUST be testable
- Tests MUST run automatically (GitHub Actions)
- Code must be structured for CI integration

## 10. Implementation Scope Rule

DO NOT:

- Build entire system at once
- Mix multiple user stories in one implementation

DO:

- Implement ONE user story at a time
- Fully complete (frontend + backend + test)
- Then move to next

## 11. Simplicity Rule

- Prefer simple Java classes over complex frameworks
- Avoid unnecessary abstraction
- Follow OO design strictly

## 12. Critical Warning

Any violation of:

- BCE separation
- Design-code consistency
- TDD workflow

is considered a project rule violation and must be corrected before the implementation is accepted.
