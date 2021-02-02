exports.up = function(knex) {
    return knex.schema.table('tiktok.tag_data', function(t){
        t.index('name', 'tag_data_tag_name');
    });
  
};

exports.down = function(knex) {
    return knex.schema.table('tiktok.tag_data', function(t){
        t.dropIndex('name', 'tag_data_tag_name');
    });
};
