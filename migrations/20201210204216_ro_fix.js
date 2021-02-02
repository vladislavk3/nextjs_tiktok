
exports.up = function(knex) {
  return knex.schema.raw(`  
  GRANT SELECT ON ALL TABLES IN SCHEMA tiktok_next TO readonly;
  ALTER DEFAULT PRIVILEGES IN SCHEMA tiktok_next GRANT SELECT ON TABLES TO readonly;
  `);
};

exports.down = function(knex) {
};
