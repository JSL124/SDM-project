# Data Persistence Design: Create User Profile

## Database Technology
PostgreSQL

## Persistence Objective
Store user profile data including role and description.

## Main Table
`user_profile`

## Table Definition
```sql
create table user_profile (
  profile_id bigserial primary key,
  role varchar(50),
  description varchar(500),
  created_at timestamp not null default current_timestamp
);
```

## Column Descriptions
- `profile_id`: Unique identifier for the profile, auto-generated.
- `role`: Profile role name.
- `description`: Profile role description.
- `created_at`: Timestamp showing when the profile was created.

## Queries Required for Create Profile

### Insert new profile
```sql
insert into user_profile (role, description) values (?, ?);
```

## Persistence Rules
- The create profile use case inserts the supplied role and description.
- Database errors cause `UserProfile.createProfile(role, description)` to return `null`.

## Mapping to BCE
- Boundary does not access the database directly.
- Controller triggers the create profile use case.
- Entity performs PostgreSQL insert operations.
- PostgreSQL is the system of record for user profile data.
