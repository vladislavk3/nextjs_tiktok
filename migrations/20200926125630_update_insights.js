
exports.up = function(knex) {
  return knex.schema.table('tiktok_next.insights', function(table) {
    table.dropColumn('_views');
    table.dropColumn('fyp_views');
    table.dropColumn('follow_views');
    table.dropColumn('hashtag_views');
    table.dropColumn('profile_views');

    table.float('sound_percent');
    table.float('fyp_percent');
    table.float('follow_percent');
    table.float('hashtag_percent');
    table.float('profile_percent');
    table.integer('duration').alter();
    table.float('watch_time').alter();
  })
};

exports.down = function(knex) {
    return knex.schema.table('tiktok_next.insights', function(table) {
    table.bigInteger('_views');
    table.bigInteger('fyp_views');
    table.bigInteger('follow_views');
    table.bigInteger('hashtag_views');
    table.bigInteger('profile_views');

    table.dropColumn('sound_percent');
    table.dropColumn('fyp_percent');
    table.dropColumn('follow_percent');
    table.dropColumn('hashtag_percent');
    table.dropColumn('profile_percent');
  })
};
