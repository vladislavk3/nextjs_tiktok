import { getSession } from 'next-auth/client'
const { Model } = require('objection');
import { pg } from 'helpers/db'
Model.knex(pg);

export default async (req, res) => {
    const session = await getSession({ req })
    const { tos } = req?.query
    if(!session) {
        res.statusCode = 500
        res.json({'error': 'not_logged_in'});
        return;
    }
    if (!tos)  {
        res.statusCode = 500
        res.json({'error': 'tos'});
        return;
    }    
    const user_id = await validUser(session)
    await Profile.query().where('user_id', user_id)
    .patch({tos_accepted_date: 'now()',
    privacy_accepted_date: 'now()'})
    
    const saved = await AccountApproved.query().insert({
        user_id,
        token: 'post beta'
    })
    
    res.statusCode = 200
    res.json({saved});
}

async function validUser(session) {
    const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        where access_token = (?)`, [session.accessToken]).then(r => r.rows[0])
    return res['user_id']
}

class AccountApproved extends Model {
    static get tableName() {
      return 'tiktok_next.account_approved';
    }
}
class Profile extends Model {
    static get tableName() {
      return 'tiktok_next.profiles';
    }
}