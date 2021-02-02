exports.up = function(knex) {
    return knex.schema.table('tiktok.stats_users', function (table) {
        table.index(['name', 'fetch_time']);
    })
};

exports.down = function(knex) {
    return knex.schema.table('tiktok.stats_users', function (table) {
        table.dropIndex(['name', 'fetch_time']);
    })
};
