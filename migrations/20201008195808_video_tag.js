
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('tiktok.video_tag', function(t){
        t.bigint('video_id').notNullable();
        t.bigint('challenge_id').notNullable();
        t.timestamp('fetch_time');
        t.text('tag_name');
    });
  
};

exports.down = function(knex) {
  return Promise.resolve(true)
};
