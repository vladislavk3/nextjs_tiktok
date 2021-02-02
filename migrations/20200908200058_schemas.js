
exports.up = function(knex) {
  return knex.raw(`
    create schema if not exists tiktok;
    create schema if not exists tiktok_authentication;
    create schema if not exists tiktok_next;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `)
};

exports.down = function(knex) {
  
};
