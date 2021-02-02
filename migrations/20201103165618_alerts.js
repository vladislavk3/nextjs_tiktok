exports.up = function(knex) {
    return knex.raw(`
        CREATE TYPE tiktok_next.alert_type AS ENUM 
        ('Systemwide', 'User', 'UserUpdate');
    `).then(() => knex.schema.createTable('tiktok_next.alerts', function(table) {
        table.increments('alert_id');
        table.integer('user_id');
        table.specificType('alert_type', 'tiktok_next.alert_type')
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.unique('alert_id');
        table.index('user_id');
        table.index('alert_id');
    })).then(() => knex.schema.createTable('tiktok_next.alerts_users', function(table) {
        table.increments();
        table.integer('user_id');
        table.integer('alert_id');
        table.boolean('seen')
        table.unique(['user_id', 'alert_id']);
        table.index(['user_id', 'alert_id']);
    }))  
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.alerts').then(() => knex.raw(`
        drop TYPE tiktok_next.alert_type;
    `)).then(() => knex.schema.dropTable('tiktok_next.alerts_users'))
};