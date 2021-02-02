
exports.up = function(knex) {
  return knex.schema.alterTable('tiktok.video_tag', table => {
    table.bigint('challenge_id').nullable().alter();
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('tiktok.video_tag', table => {
      table.bigint('challenge_id').notNullable().alter();
    })  
};
