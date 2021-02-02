const SUBSCRIPTION_TABLE = "tiktok_next.top_accounts"

exports.up = function(knex) {
    return knex.schema.createTable(SUBSCRIPTION_TABLE, function(table) {
        table.increments();
        table.jsonb('data');
        table.datetime('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(SUBSCRIPTION_TABLE)
};