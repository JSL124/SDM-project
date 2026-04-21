# Test Data: Create User Account

## Purpose
Provide deterministic account and profile records for create user account testing.

## Sample Profiles
```text
Profile A (existing profile for account creation)
- profileId: 1
- name: Lee Jinseo
- email: jason21888@naver.com
- phoneNum: 0412345678
- address: 123 Test St
- expected use: successful account creation scenario

Profile B (another existing profile)
- profileId: 2
- name: Monica Cheng
- email: Monica.9.ais@gmail.com
- phoneNum: 0498765432
- address: 456 Example Ave
- expected use: alternate successful account creation scenario

Profile C (missing profile reference)
- profileId: 999
- expected use: profile not found scenario
```

## Sample Accounts
```text
Account A (existing username for duplicate test)
- username: existinguser
- password: Password123!
- role: Donee
- profileId: 1
- expected use: username already exists scenario

Account B (new account for successful creation)
- username: newuser
- password: Password123!
- role: Fundraiser
- profileId: 1
- expected use: successful account creation
```

## Seed Data Template
```sql
insert into user_profile (name, email, phone_num, address)
values
  ('Lee Jinseo', 'jason21888@naver.com', '0412345678', '123 Test St'),
  ('Monica Cheng', 'Monica.9.ais@gmail.com', '0498765432', '456 Example Ave');

insert into user_account (email, password_hash, account_status, username, profile_id, role)
values
  ('jason21888@naver.com', '$2b$10$examplehash', 'ACTIVE', 'existinguser', 1, 'Donee');
```

## Data Handling Rules
- Seed data is used for testing username uniqueness checks and valid profile linking.
- Account creation tests require both existing and non-existing profile ID scenarios.
- The stored account email must match the linked profile email in the current implementation.
