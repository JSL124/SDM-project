-- Align account and profile tables with the provided BCE diagrams.

ALTER TABLE user_account ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE user_account ADD COLUMN IF NOT EXISTS dob VARCHAR(50);
ALTER TABLE user_account ADD COLUMN IF NOT EXISTS phone_num VARCHAR(50);

ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS role VARCHAR(50);
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS description VARCHAR(500);

ALTER TABLE user_profile DROP COLUMN IF EXISTS name;
ALTER TABLE user_profile DROP COLUMN IF EXISTS email;
ALTER TABLE user_profile DROP COLUMN IF EXISTS phone_num;
ALTER TABLE user_profile DROP COLUMN IF EXISTS address;
ALTER TABLE user_profile DROP COLUMN IF EXISTS created_at;
