exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.stripe_session', function(table) {
        table.increments();
        table.text('stripe_session_id');
        table.integer('user_id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('stripe_session_id', 'stripe_session_stripe_session_id');
    }) 
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.stripe_session')
};
