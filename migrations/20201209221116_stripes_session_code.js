const TABLE = 'tiktok_next.stripe_session'

exports.up = function(knex) {
  return knex.schema.table(TABLE, function (table) {
       table.text('referral_code');
   })
};

exports.down = function(knex) {
   knex.schema.table(TABLE, function (table) {
       table.dropColumn('referral_code');
   }) 
};
