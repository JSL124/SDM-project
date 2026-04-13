# Test Data: Create User Profile

## Purpose
Provide deterministic profile records for create user profile testing.

## Sample Profiles
```text
Profile A (existing profile for duplicate email test)
- name: Existing User
- email: existing.user@example.com
- phoneNum: 0412345678
- address: 123 Test St, Sydney NSW 2000
- expected use: email already exists scenario

Profile B (new profile for successful creation)
- name: New User
- email: new.user@example.com
- phoneNum: 0498765432
- address: 456 Example Ave, Melbourne VIC 3000
- expected use: successful profile creation

Profile C (missing email for validation test)
- name: Incomplete User
- email: (empty)
- phoneNum: 0411111111
- address: 789 Sample Rd, Brisbane QLD 4000
- expected use: empty email validation scenario
```

## Seed Data Template
```sql
insert into user_profile (name, email, phone_num, address)
values
  ('Existing User', 'existing.user@example.com', '0412345678', '123 Test St, Sydney NSW 2000');
```

## Data Handling Rules
- Seed data is used for testing email uniqueness checks.
- Test profiles should cover both existing and non-existing email scenarios.
