const SUBSCRIPTION_TABLE = "tiktok_next.top_accounts_normalized"

exports.up = function(knex) {
    return knex.schema.createTable(SUBSCRIPTION_TABLE, function(table) {
        table.text('author');
        table.bigint('followers');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.unique('author')
    }).then(() => knex.raw(`
        insert into ${SUBSCRIPTION_TABLE} (author, followers)
        select v ->> 'platform_unique_id' author, (v ->> 'followers')::bigint followers
        from (
          SELECT jsonb_array_elements(data -> 'hit_sources') v
          FROM tiktok_next.top_accounts
        ) q
        on conflict do nothing
      `)
    )
};

exports.down = function(knex) {
    return knex.schema.dropTable(SUBSCRIPTION_TABLE)
};