
exports.up = function(knex) {
      return knex.schema.createTable('tiktok_authentication.cookies', function(table) {
    table.increments();
    table.integer('user_id').notNull();
    table.text('author').notNull();
    table.text('cookie').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('user_id', 'cookies_user_id');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('tiktok_authentication.cookies')  
};
