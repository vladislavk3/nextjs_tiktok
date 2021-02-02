
exports.up = function(knex) {
    return knex.schema.table('tiktok_next.profiles', function (table) {
        table.bool('admin');
        table.bool('pro');
    })
};

exports.down = function(knex) {
    return knex.schema.table('tiktok_next.profiles', function (table) {
        table.dropColumn('admin');
        table.dropColumn('pro');
    })
};
