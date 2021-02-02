
exports.up = function(knex) {
    return knex.schema.raw(`
    create or replace function tiktok_authentication.clear_user_auth(emailAddress text)
    returns void
    as
    $$
    begin
    DELETE from tiktok_authentication.accounts 
        using tiktok_authentication.users
        where users.id = accounts.user_id and users.email = emailAddress;
    DELETE from tiktok_authentication.sessions 
        using tiktok_authentication.users
        where users.id = sessions.user_id and users.email = emailAddress;
    DELETE from tiktok_authentication.cookies 
        using tiktok_authentication.users
        where users.id = cookies.user_id and users.email = emailAddress;
    DELETE from tiktok_authentication.users
        where  users.email = emailAddress;
    end;
    $$ language 'plpgsql'; 
    `);
  };
  
  exports.down = function(knex) {
      return knex.schema.raw(`
          drop function tiktok_authentication.clear_user_auth(emailAddress text);
    `);
  };
  