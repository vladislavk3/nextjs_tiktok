exports.up = function(knex) {
    return knex.schema.createTable('tiktok_next.tokboard_song', function(table) {
        table.increments();
        table.bigint('song_id');
        table.text('title');
        table.text('author');
        table.bigint('plays');
        table.date('peak_day');
        table.jsonb('tags');        
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('song_id', 'tokboard_song_song_id');
    }) 
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.tokboard_song')
};