# Data Persistence Design: Fundraiser Login

## Database Technology
PostgreSQL

## Persistence Objective
Store fundraiser account credentials securely and support lookup by email during login.

## Main Table
`user_account`

## Table Definition
```sql
create table user_account (
  user_account_id bigserial primary key,
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  account_status varchar(30) not null default 'ACTIVE',
  created_at timestamp not null default current_timestamp
);
```

## Column Descriptions
- `user_account_id`: Unique identifier for the account.
- `email`: Unique login identity provided by the fundraiser.
- `password_hash`: Securely hashed password value. Plain-text passwords must never be stored.
- `account_status`: Current account state such as `ACTIVE` or `DISABLED`.
- `created_at`: Timestamp showing when the account was created.

## Query Required for Login
```sql
select user_account_id, email, password_hash, account_status
from user_account
where email = ?;
```

## Persistence Rules
- Email must be unique.
- Passwords must be stored only as hashes.
- Only active accounts may complete login successfully.
- The login use case performs read access only. No account data is modified during standard login.

## Mapping to BCE
- Boundary does not access the database directly.
- Controller triggers the login use case.
- Entity or repository performs PostgreSQL lookup.
- PostgreSQL is the system of record for account authentication data.
