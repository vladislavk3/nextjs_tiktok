
exports.up = function(knex){
    return knex.schema.createTableIfNotExists('tiktok.user_videos', function(t){
        t.bigint('video_id').notNullable();
        t.text('description');
        t.integer('duration');
        t.integer('likes');
        t.integer('shares');
        t.integer('comments');
        t.bigint('views');
        t.timestamp('fetchedat');
        t.bigint('soundid');
        t.text('author');
        t.boolean('duet_enabled');
        t.boolean('stitch_enabled');
        t.boolean('self_liked');
        t.specificType('create_time', 'timestamp');
    });
};

exports.down = function(knex){
    return Promise.resolve(true)
};
