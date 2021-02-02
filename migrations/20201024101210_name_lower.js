
exports.up = function(knex) {
    return knex.schema.raw(`
    create or replace function tiktok_next.clean_name(name text)

    returns text
    as
    $$
    begin
        return lower(trim(replace(name, '@', '')));
    end;
    $$ language 'plpgsql'
    immutable
    strict; 
    `);
  };
  
  exports.down = function(knex) {
    return knex.schema.raw(`
    create or replace function tiktok_next.clean_name(name text)

    returns text
    as
    $$
    begin
        return trim(replace(name, '@', ''));
    end;
    $$ language 'plpgsql'
    immutable
    strict; 
    `);
  };
  