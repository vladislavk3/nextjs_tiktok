
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE if not exists tiktok_authentication.accounts
  (
    id                   SERIAL,
    compound_id          VARCHAR(255) NOT NULL,
    user_id              INTEGER NOT NULL,
    provider_type        VARCHAR(255) NOT NULL,
    provider_id          VARCHAR(255) NOT NULL,
    provider_account_id  VARCHAR(255) NOT NULL,
    refresh_token        TEXT,
    access_token         TEXT,
    access_token_expires TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

CREATE TABLE if not exists  tiktok_authentication.sessions
  (
    id            SERIAL,
    user_id       INTEGER NOT NULL,
    expires       TIMESTAMPTZ NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    access_token  VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

CREATE TABLE if not exists  tiktok_authentication.users
  (
    id             SERIAL,
    name           VARCHAR(255),
    email          VARCHAR(255),
    email_verified TIMESTAMPTZ,
    image          VARCHAR(255),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

CREATE TABLE if not exists  tiktok_authentication.verification_requests
  (
    id         SERIAL,
    identifier VARCHAR(255) NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires    TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

CREATE UNIQUE INDEX if not exists  compound_id
  ON tiktok_authentication.accounts(compound_id);

CREATE INDEX if not exists  provider_account_id
  ON tiktok_authentication.accounts(provider_account_id);

CREATE INDEX if not exists  provider_id
  ON tiktok_authentication.accounts(provider_id);

CREATE INDEX if not exists  user_id
  ON tiktok_authentication.accounts(user_id);

CREATE UNIQUE INDEX if not exists  session_token
  ON tiktok_authentication.sessions(session_token);

CREATE UNIQUE INDEX if not exists  access_token
  ON tiktok_authentication.sessions(access_token);

CREATE UNIQUE INDEX if not exists  email
  ON tiktok_authentication.users(email);

CREATE UNIQUE INDEX if not exists  token
  ON tiktok_authentication.verification_requests(token);

  `)
};

exports.down = function(knex) {
  
};
