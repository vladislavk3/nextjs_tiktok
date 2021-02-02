
exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.insights', function(table) {
    table.increments();
    table.bigInteger('video_id').notNull();
    table.text('author').notNull();
    table.string('description');
    table.bigInteger('_views');
    table.bigInteger('fyp_views');
    table.bigInteger('follow_views');
    table.bigInteger('hashtag_views');
    table.bigInteger('profile_views');
    table.bigInteger('total_views');
    table.bigInteger('unique_views');
    table.integer('duration');
    table.integer('watch_time');
    table.bigInteger('followers');    
    table.timestamp('video_created_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('video_id', 'insights_video_id');
    table.index('author', 'insights_are');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('tiktok_next.insights')
};
