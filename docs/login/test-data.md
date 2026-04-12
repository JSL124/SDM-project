# Test Data: Fundraiser Login

## Purpose
Provide deterministic account records for login testing.

## Sample Accounts
```text
Account A
- email: active.fundraiser@example.com
- raw password for test only: Fundraiser123!
- account_status: ACTIVE
- expected use: successful login

Account B
- email: wrongpass.fundraiser@example.com
- raw password for test only: CorrectPass123!
- account_status: ACTIVE
- expected use: invalid password scenario

Account C
- email: disabled.fundraiser@example.com
- raw password for test only: Disabled123!
- account_status: DISABLED
- expected use: disabled account scenario

Account D
- email: missing.fundraiser@example.com
- expected use: account does not exist scenario
```

## Seed Data Template
```sql
insert into user_account (email, password_hash, account_status)
values
  ('active.fundraiser@example.com', '<bcrypt-hash-for-Fundraiser123!>', 'ACTIVE'),
  ('wrongpass.fundraiser@example.com', '<bcrypt-hash-for-CorrectPass123!>', 'ACTIVE'),
  ('disabled.fundraiser@example.com', '<bcrypt-hash-for-Disabled123!>', 'DISABLED');
```

## Data Handling Rules
- Use hashed passwords only in the database.
- Raw passwords are documented here only for test execution clarity.
- Production data must never store raw passwords.
