-- Test data for login use case
-- Raw passwords (for test reference only, NEVER store in production):
--   Account A: Fundraiser123!
--   Account B: CorrectPass123!
--   Account C: Disabled123!
--   Account D: missing.fundraiser@example.com (no record - tests "account not found")

-- Generate bcrypt hashes before inserting. Use the helper script:
--   cd backend && npx tsx scripts/hash-passwords.ts

INSERT INTO user_account (email, password_hash, account_status) VALUES
  ('active.fundraiser@example.com',    '$2b$10$jSmRG6vlzmy20Z8GyFxmB.wCh5byKZgOjpaSIOPwJse0zX1ENIuoO',  'ACTIVE'),
  ('wrongpass.fundraiser@example.com', '$2b$10$E/zQKuGsL9Vc1aG0jYB9Xuro7rOrgBUt3H8HdOjNpcxN1nNNwSVGC', 'ACTIVE'),
  ('disabled.fundraiser@example.com',  '$2b$10$7UrWmgDNAZrnNH.6kPqc9.dzc8YL9LzkG5BDPuooetd7nJP1QZk4e', 'DISABLED');
