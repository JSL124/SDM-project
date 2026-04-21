-- Test data for login use case
-- Raw passwords:
--   Account A: Fundraiser123!
--   Account B: CorrectPass123!
--   Account C: Disabled123!
--   Account D: missing.fundraiser@example.com (no record - tests "account not found")

INSERT INTO user_account (email, password, account_status) VALUES
  ('active.fundraiser@example.com',    'Fundraiser123!',  'ACTIVE'),
  ('wrongpass.fundraiser@example.com', 'CorrectPass123!', 'ACTIVE'),
  ('disabled.fundraiser@example.com',  'Disabled123!',    'DISABLED');
