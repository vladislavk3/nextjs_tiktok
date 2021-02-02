
exports.up = function(knex) {
  return knex.schema.raw(`
  create or replace function tiktok_next.clear_user_data(username text)
  returns void
  as
  $$
  begin
  DELETE from tiktok.stats_users where name=username;
  DELETE from tiktok_next.insights where author=username;
  DELETE from tiktok_next.user_videos where author=username;
  commit;
  end;
  $$ language 'plpgsql'; 
  `);
};

exports.down = function(knex) {
    return knex.schema.raw(`
        drop function tiktok_next.clear_user_data(username text);
  `);
};
