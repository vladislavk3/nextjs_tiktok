exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.stripe_subscription', function(table) {
        table.increments();
        table.text('stripe_customer_id');
        table.text('stripe_email');
        table.text('subscription_id');
        table.text('stripe_session_id');
        table.jsonb('stripe_response');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('stripe_customer_id', 'stripe_stripe_customer_id');
        table.index('stripe_session_id', 'stripe_stripe_session_id');
    }) 
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.stripe_subscription')
};
