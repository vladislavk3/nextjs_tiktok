exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.authentication_events', function(table) {
        table.increments();
        table.integer('user_id');
        table.text('event')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('user_id', 'authentication_eventsuser_id');
    }) 
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.authentication_events')
};
