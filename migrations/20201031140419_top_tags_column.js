exports.up = function(knex) {
    return knex.schema.table('tiktok.user_videos', function (table) {
        table.bool('top_for_tags');
    })
};

exports.down = function(knex) {
    return knex.schema.table('tiktok.user_videos', function (table) {
        table.dropColumn('top_for_tags');
    })
};
