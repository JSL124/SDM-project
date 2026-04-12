-- Test data for login use case
-- Raw passwords (for test reference only, NEVER store in production):
--   Account A: Fundraiser123!
--   Account B: CorrectPass123!
--   Account C: Disabled123!
--   Account D: missing.fundraiser@example.com (no record - tests "account not found")

-- Generate bcrypt hashes before inserting. Use the helper script:
--   cd backend && npx tsx scripts/hash-passwords.ts

INSERT INTO user_account (email, password_hash, account_status) VALUES
  ('active.fundraiser@example.com',    '$2b$10$placeholder_hash_for_Fundraiser123!',  'ACTIVE'),
  ('wrongpass.fundraiser@example.com', '$2b$10$placeholder_hash_for_CorrectPass123!', 'ACTIVE'),
  ('disabled.fundraiser@example.com',  '$2b$10$placeholder_hash_for_Disabled123!',    'DISABLED');
