exports.up = function(knex) {
    return knex.schema.table('tiktok.tag_data', function (table) {
        table.bool('estimated_videos');
    })
};

exports.down = function(knex) {
    return knex.schema.table('tiktok.tag_data', function (table) {
        table.dropColumn('estimated_videos');
    })
};
