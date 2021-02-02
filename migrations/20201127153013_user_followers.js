const SUBSCRIPTION_TABLE = "tiktok_next.user_followers"

exports.up = function(knex) {
    return knex.schema.createTable(SUBSCRIPTION_TABLE, function(table) {
        table.text('author');
        table.text('following_author');
        table.datetime('started_following');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.index('author')
    })
    
};

exports.down = function(knex) {
    return knex.schema.dropTable(SUBSCRIPTION_TABLE)
};