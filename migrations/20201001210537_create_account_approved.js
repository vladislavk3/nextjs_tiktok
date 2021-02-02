
exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.account_approved', function(table) {
    table.increments();
    table.integer('user_id').notNull();
    table.text('token').notNull();
    table.index('user_id', 'account_approved_user_id');
  });    
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.account_approved')    
};
