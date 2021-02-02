exports.up = function(knex) {
    return knex.schema.table('tiktok.video_tag', function(t){
        t.index('tag_name', 'video_tag_tag_name');
    });
  
};

exports.down = function(knex) {
    return knex.schema.table('tiktok.video_tag', function(t){
        t.dropIndex('tag_name', 'video_tag_tag_name');
    });
};
