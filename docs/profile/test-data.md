# Test Data: Create User Profile

## Purpose
Provide deterministic profile records for create user profile testing.

## Sample Profiles
```text
Profile A (new profile for successful creation)
- role: Fundraiser
- description: Creates fundraising activities
- expected use: successful profile creation

Profile B (missing role for validation test)
- role: (empty)
- description: Creates fundraising activities
- expected use: empty role validation scenario

Profile C (missing description for validation test)
- role: Fundraiser
- description: (empty)
- expected use: empty description validation scenario
```

## Seed Data Template
```sql
insert into user_profile (role, description)
values
  ('Fundraiser', 'Creates fundraising activities');
```

## Data Handling Rules
- Test profiles should cover successful insert and `null` failure outcomes.
- Boundary validation test data must cover missing role and missing description.
