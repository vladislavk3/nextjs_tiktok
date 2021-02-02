
exports.up = function(knex) {
    return knex.raw(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);
 
};

exports.down = function(knex) {
};
