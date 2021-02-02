// Update with your config settings.
const file_name = process.env.NODE_ENV == 'test' ? '.env.test' : 
                    process.env.NODE_ENV == 'production' ? '.env.prod' : '.env.local';
require('dotenv').config({ path: file_name });

module.exports = {
  client: 'postgresql',
  connection: process.env.DB_URL,
  pool: {
    min: 0,
    max: 1
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
