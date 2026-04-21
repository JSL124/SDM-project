-- Online Fundraiser Platform - Database Schema

CREATE TABLE user_account (
  user_account_id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profile (
  profile_id BIGSERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  description VARCHAR(500)
);
