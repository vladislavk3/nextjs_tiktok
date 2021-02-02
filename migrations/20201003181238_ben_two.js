
exports.up = function(knex) {
        return knex.schema.raw(`
        CREATE OR REPLACE FUNCTION tiktok_authentication.clear_user_auth(
            emailaddress text)
            RETURNS void
            LANGUAGE 'plpgsql'
        
            COST 100
            VOLATILE 
            
        AS $BODY$
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
            $BODY$;
        

        CREATE OR REPLACE FUNCTION tiktok_next.clear_user_data(
            username text)
            RETURNS void
            LANGUAGE 'plpgsql'
        
            COST 100
            VOLATILE 
            
        AS $BODY$
        begin
        DELETE from tiktok.stats_users where name=username;
        DELETE from tiktok_next.insights where author=username;
        DELETE from tiktok.user_videos where author=username;
        end;
        $BODY$;
        `);
};

exports.down = function(knex) {
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
