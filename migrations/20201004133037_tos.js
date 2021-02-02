
exports.up = function(knex) {
    return knex.schema.table('tiktok_next.profiles', function (table) {
        table.timestamp('tos_accepted_date');
        table.timestamp('privacy_accepted_date');
    })
};

exports.down = function(knex) {
    return knex.schema.table('tiktok_next.profiles', function (table) {
        table.dropColumn('tos_accepted_date');
        table.dropColumn('privacy_accepted_date');
    })
};
