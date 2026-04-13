-- Add username, profile_id, and role columns to user_account table

ALTER TABLE user_account ADD COLUMN username VARCHAR(255) UNIQUE;
ALTER TABLE user_account ADD COLUMN profile_id BIGINT REFERENCES user_profile(profile_id);
ALTER TABLE user_account ADD COLUMN role VARCHAR(30) NOT NULL DEFAULT 'Fundraiser';
