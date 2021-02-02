const SUBSCRIPTION_TABLE = "tiktok_next.push_subscriptions"

exports.up = function(knex) {
    return knex.schema.createTable(SUBSCRIPTION_TABLE, function(table) {
        table.increments();
        table.integer('user_id');
        table.text('endpoint');
        table.datetime('expirationTime');
        table.jsonb('keys');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.index(['user_id']);
        table.index(['endpoint']);
        table.unique(['endpoint']);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(SUBSCRIPTION_TABLE)
};