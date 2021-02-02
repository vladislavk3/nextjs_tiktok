
exports.up = function(knex) {
   return knex.schema.table('tiktok_authentication.cookies', function (table) {
        table.text('encrypted_cookie');
    }).then (()=> knex.raw(`
        update tiktok_authentication.cookies
        set encrypted_cookie = PGP_SYM_ENCRYPT(cookie, '${process.env.PG_COLUMN_PASSWORD}')
    `))
};

exports.down = function(knex) {
    knex.schema.table('tiktok_next.profiles', function (table) {
        table.dropColumn('encrypted_cookie');
    }) 
};
