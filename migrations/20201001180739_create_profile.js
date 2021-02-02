
exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.profiles', function(table) {
    table.increments();
    table.integer('user_id').notNull().unique();
    table.text('tiktok_username');
    table.text('email');
    table.boolean('receive_emails').defaultTo(true);
    table.text('given_name');
    table.text('family_name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('user_id', 'profiles_user_id');
    table.index('tiktok_username', 'profiles_tiktok_username');
  });  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.profiles')  
};
