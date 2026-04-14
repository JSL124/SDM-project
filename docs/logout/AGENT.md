# AGENT.md - Logout Feature Guide

## 1. Purpose and Scope

This guide applies to logout-related work only.

Use this file when the task touches any of the following:

- `docs/logout`
- `frontend/src/feature/logout` (future location)
- `backend/src/logout` (future location)
- logout HTTP route files (future location)

This file supplements the repository-wide rules in the root `AGENT.md`. Shared architecture, BCE, and TDD rules still come from the root guide.

## 2. Related Code Locations

- Frontend boundary: `frontend/src/feature/logout/boundary/LogoutPage.ts`
- Backend controller: `backend/src/logout/controller/LogoutController.ts`
- HTTP route adapter: `backend/src/routes/logoutRoutes.ts`

## 3. Related Design Documents

Logout work MUST stay consistent with the design documents in `docs/logout/`:

- `bce-diagram.md`
- `sequence-diagram.md`
- `use-case-description.md`

## 4. Feature-Specific Rules

- Logout work MUST preserve BCE separation across boundary and controller
- Logout boundary MUST NOT access any entity directly
- Logout success behavior MUST redirect the user to the login page exactly as defined in the logout design artifacts
- The same logout design rules apply to `Fundraiser`, `Donee`, `User admin`, and `Platform manager`
- Logout naming MUST remain consistent across all logout documents: `LogoutPage`, `LogoutController`, `logout()`, and `displayLoginPage()`

## 5. Required Logout Review Coverage

The logout document set MUST verify:

- All four actors are represented: `Fundraiser`, `Donee`, `User admin`, `Platform manager`
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
- All four actors are named consistently in logout documents
- `LogoutPage` and `LogoutController` are the only BCE classes referenced in the current logout design
- `displayLoginPage()` is used consistently as the post-logout UI transition
- The implemented logout boundary file remains `frontend/src/feature/logout/boundary/LogoutPage.ts`
