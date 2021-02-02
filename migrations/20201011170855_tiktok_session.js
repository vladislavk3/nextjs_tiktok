exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('tiktok_next.tiktok_session', function(t){
        t.increments().notNullable();
        t.text('username');
        t.text('cookie');
    });  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.tiktok_session')
};