
exports.up = function(knex) {
    return knex.schema.dropTable('tiktok_next.profiles').then(() => {
        return knex.schema.createTable('tiktok_next.profiles', function(table) {
            table.increments();
            table.integer('user_id').notNull().unique();
            table.text('tiktok_username');
            table.text('email');
            table.boolean('receive_emails').defaultTo(true);
            table.text('name');
            table.text('invite_code');
            table.integer('max_invites').defaultTo(3);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.index('user_id', 'profiles_user_id');
            table.index('tiktok_username', 'profiles_tiktok_username');
        }).then(() => {
            return knex.schema.raw(`
                insert into tiktok_next.profiles(user_id, email, name)
                select id, email, name from tiktok_authentication.users
            `).then(() => {
                return knex.schema.raw(`                
                select user_id from tiktok_next.profiles
                `).then(r => {                    
                    const randomChoice = (arr) => arr[Math.floor(arr.length * Math.random())];
                    const words = ['stretching', 'his', 'hand', 'up', 'to', 'reach', 'the', 'stars', 'too', 'often', 'man', 'forgets', 'the', 'flowers', 'at', 'his', 'feet']
                    const randomCode = () => randomChoice(words) + randomChoice(words) + randomChoice(words)
                    
                    const updates = r.rows.map(r => knex.schema.raw(`update tiktok_next.profiles set invite_code = (?) where user_id = (?)`, [randomCode(), r['user_id']]))
                    return Promise.all(updates)
                })
            })
        })
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tiktok_next.profiles').then(() => {
        return knex.schema.createTable('tiktok_next.profiles', function(table) {
            table.increments();
            table.integer('user_id').notNull().unique();
            table.text('tiktok_username');
            table.text('email');
            table.boolean('receive_emails').defaultTo(true);
            table.text('given_name');
            table.text('family_name');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.index('user_id', 'profiles_user_id');
            table.index('tiktok_username', 'profiles_tiktok_username');
        });  
    });
};
