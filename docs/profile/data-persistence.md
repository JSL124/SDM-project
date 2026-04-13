# Data Persistence Design: Create User Profile

## Database Technology
PostgreSQL

## Persistence Objective
Store user profile data including name, email, phone number, and address, and enforce email uniqueness.

## Main Table
`user_profile`

## Table Definition
```sql
create table user_profile (
  profile_id bigserial primary key,
  name varchar(255) not null,
  email varchar(255) unique not null,
  phone_num varchar(50) not null,
  address varchar(500) not null,
  created_at timestamp not null default current_timestamp
);
```

## Column Descriptions
- `profile_id`: Unique identifier for the profile, auto-generated.
- `name`: Full name of the user.
- `email`: Unique email address for the user profile.
- `phone_num`: Phone number of the user.
- `address`: Address of the user.
- `created_at`: Timestamp showing when the profile was created.

## Queries Required for Create Profile

### Check if email exists
```sql
select 1 from user_profile where email = ?;
```

### Insert new profile
```sql
insert into user_profile (name, email, phone_num, address) values (?, ?, ?, ?);
```

## Persistence Rules
- Email must be unique across all user profiles.
- All fields (name, email, phone_num, address) are required and cannot be null.
- The create profile use case performs a uniqueness check followed by an insert.

## Mapping to BCE
- Boundary does not access the database directly.
- Controller triggers the create profile use case.
- Entity performs PostgreSQL lookup and insert operations.
- PostgreSQL is the system of record for user profile data.
