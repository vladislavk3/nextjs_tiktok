const SUBSCRIPTION_TABLE = "tiktok_next.stripe_events"

exports.up = function(knex) {
    return knex.schema.createTable(SUBSCRIPTION_TABLE, function(table) {
        table.text('customer_id');
        table.jsonb('stripe_data');
        table.text('status');
        table.text('event_type');
        table.datetime('cancel_at');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.index('customer_id')
    })    
};

exports.down = function(knex) {
    return knex.schema.dropTable(SUBSCRIPTION_TABLE)
};