const SUBSCRIPTION_TABLE = "tiktok_next.push_history"

exports.up = function(knex) {
    return knex.schema.createTable(SUBSCRIPTION_TABLE, function(table) {
        table.increments();
        table.integer('user_id');
        table.integer('alert_id');
        table.integer('push_subscription_id');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.index(['user_id']);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(SUBSCRIPTION_TABLE)
};