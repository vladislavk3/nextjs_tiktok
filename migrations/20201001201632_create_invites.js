
exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.invites', function(table) {
    table.increments();
    table.integer('user_id').notNull();
    table.uuid('token').notNull().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('available').notNull();
    table.integer('used').notNull();
    table.index('user_id', 'invites_user_id');
  });  
  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.invites')    
};
