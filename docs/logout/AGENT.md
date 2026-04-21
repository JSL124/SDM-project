# AGENT.md - Logout Feature Guide

## 1. Purpose and Scope

This guide applies to logout-related work only.

Use this file when the task touches any of the following:

- `docs/logout`
- `frontend/src/feature/logout`

This file supplements the repository-wide rules in the root `AGENT.md`. Shared architecture, BCE, and TDD rules still come from the root guide.

## 2. Related Code Locations

- Frontend boundary: `frontend/src/feature/logout/boundary/LogoutPage.ts`

## 3. Related Design Documents

Logout work MUST stay consistent with the design documents in `docs/logout/`:

- `bce-diagram.md`
- `sequence-diagram.md`
- `use-case-description.md`

## 4. Feature-Specific Rules

- Logout work MUST preserve the approved boundary-only logout design
- Logout boundary MUST NOT access any entity directly
- Logout success behavior MUST redirect the user to the login page exactly as defined in the logout design artifacts
- The same logout design rules apply to every logged-in profile type
- Logout naming MUST remain consistent across all logout documents: `LogoutPage` and `logout()`
- Logout MUST NOT introduce a backend route, controller, entity, or database interaction unless the approved design artifacts are updated first

## 5. Required Logout Review Coverage

The logout document set MUST verify:

- The actor is represented as any logged-in profile type
- BCE and sequence message names match exactly
- The normal flow in `use-case-description.md` matches the sequence diagram
- The final post-logout screen is the login page in every logout design artifact

## 6. Local Quality Gate for Logout Changes

For logout documentation changes, verify all of the following before push:

- `docs/logout/` contains the approved logout document set
- Logout document names and method names match exactly across files
- No logout-specific rule is duplicated back into the root `AGENT.md` unless it becomes repository-wide

## 7. Verification Checklist

Before considering logout work complete, verify:

- Logout documents follow the same Markdown storage pattern used by `docs/login`
- The actor is named consistently as any logged-in profile type
- `LogoutPage` is the only BCE class referenced in the current logout design
- `logout()` is used consistently as the logout operation
- The implemented logout boundary file remains `frontend/src/feature/logout/boundary/LogoutPage.ts`
