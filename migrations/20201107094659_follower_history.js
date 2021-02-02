const FOLLOWER_TABLE = "tiktok_next.insights_history"

exports.up = function(knex) {
    return knex.schema.createTable(FOLLOWER_TABLE, function(table) {
        table.increments();
        table.text('author');
        table.integer('follower_count');
        table.integer('video_view_count');
        table.integer('profile_view_count');
        table.date('implied_date');
        table.date('created_at').defaultTo(knex.fn.now());

        table.unique(['author', 'created_at', 'implied_date']);
        table.index(['author', 'created_at']);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable(FOLLOWER_TABLE)
};