exports.up = function(knex) {
    return knex.schema.raw(`
    create or replace view tiktok_next.pro_authors as
    (
        select distinct tiktok_next.clean_name(tiktok_username) author
        from tiktok_next.profiles
        inner join tiktok_authentication.users on users.id = profiles.user_id
        and users.pro      
        and tiktok_username is not null
        and tiktok_username != ''
    )
    `);
  };
  
  exports.down = function(knex) {
      return knex.schema.raw(`
          drop view tiktok_next.pro_authors;
    `);
  };