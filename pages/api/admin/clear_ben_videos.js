import { getSession } from 'next-auth/client'

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: {min: 0, idleTimeoutMillis: 1000}
});

export default async (req, res) => {
    const session = await getSession({ req })
    if(!session) { return error(res); }
    const user_id = await validUser(session)
    if(!user_id) { return error(res); }
    const { email } = req?.query
    if(!email) { return error(res, 'no_email'); }

    await pg.raw(`select tiktok_next.clear_user_data(?)`, [email])
    res.writeHead(302, { Location: '/'});
    res.end();
}

async function validUser(session) {
    const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        inner join tiktok_authentication.users on sessions.user_id = users.id
        where access_token = (?) and email = 'xodarap00@gmail.com'`, [session.accessToken]).then(r => r.rows[0])
    return res['user_id']
}

function error(res) {
    res.statusCode = 500
    res.json({'error': 'not_logged_in'});
}