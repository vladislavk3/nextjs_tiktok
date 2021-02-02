import { getSession } from 'next-auth/client'
const { Model } = require('objection');
import {clean_name} from 'helpers/clean_name'
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL,
  searchPath: ['knex', 'public', 'tiktok', 'tiktok_authentication'],
  pool: {min: 0, idleTimeoutMillis: 1000}
});
Model.knex(pg);
export default async (req, res) => {
    const session = await getSession({ req })
    const { id } = req?.query
    if((!session || !(await validUser(id, session)))) {
        res.statusCode = 500
        res.send(JSON.stringify({'error': 'not_logged_in', session: session}));
        return;
    }
    const { tiktok_username, email, receive_emails, given_name, family_name } = req.body
    const saved = await Profile.query().where('user_id', id)
    .patch({tiktok_username: clean_name(tiktok_username), 
      email, receive_emails, given_name, family_name})
    res.statusCode = 200
    res.json({saved});
}


async function validUser(id, session) {
    const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        where access_token = (?)`, [session.accessToken]).then(r => r.rows[0])
        return (parseInt(res['user_id']) == parseInt(id))
}

class Profile extends Model {
    static get tableName() {
      return 'tiktok_next.profiles';
    }
}