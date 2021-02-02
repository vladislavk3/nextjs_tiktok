
exports.up = function(knex) {
  const database = knex.client.config.connection.database;
  return knex.schema.raw(`
  CREATE USER readonly WITH PASSWORD --todo;
  GRANT CONNECT ON DATABASE ${database} TO readonly;
  
  GRANT USAGE ON SCHEMA tiktok TO readonly;
  GRANT SELECT ON ALL TABLES IN SCHEMA tiktok TO readonly;
  ALTER DEFAULT PRIVILEGES IN SCHEMA tiktok GRANT SELECT ON TABLES TO readonly;
  GRANT USAGE ON SCHEMA tiktok_authentication TO readonly;
  GRANT SELECT ON ALL TABLES IN SCHEMA tiktok_authentication TO readonly;
  ALTER DEFAULT PRIVILEGES IN SCHEMA tiktok_authentication GRANT SELECT ON TABLES TO readonly;
  GRANT USAGE ON SCHEMA tiktok_next TO readonly;
  GRANT SELECT ON ALL TABLES IN SCHEMA tiktok_next TO readonly;
  ALTER DEFAULT PRIVILEGES IN SCHEMA tiktok_next GRANT SELECT ON TABLES TO readonly;
  
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    drop user readonly;
  `);
};
