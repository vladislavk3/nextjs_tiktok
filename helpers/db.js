var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
    pool: {min: 0, idleTimeoutMillis: 1000}
  });
export {pg};