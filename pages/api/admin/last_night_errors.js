import { getSession } from 'next-auth/client'
import {pg} from 'helpers/db'

export default async (req, res) => {
    const session = await getSession({ req })
    if(!session) { return error(res); }
    const user_id = await validUser(session)
    if(!user_id) { return error(res); }

    const result = await pg.raw(`
    SELECT tiktok_username, alerts.user_id
    , previous_count
    , alerts.created_at
    FROM tiktok_next.alerts
    inner join tiktok_next.profiles using (user_id)
    left join (
        select user_id, count(1) previous_count
        FROM tiktok_next.alerts
        where alerts.created_at > now() - '7 days'::interval
        and description like 'Our last attempt%'
        group by user_id
        having count(1) > 1
    ) q using (user_id)
    where alerts.created_at > now() - '1 day'::interval
    and description like 'Our last attempt%'
    `).then(r => r.rows)

    res.json(result);
}

async function validUser(session) {
    const res = await pg.raw(`
        select user_id
        from  tiktok_authentication.sessions 
        inner join tiktok_authentication.users on sessions.user_id = users.id
        where access_token = (?) and email = 'xodarap00@gmail.com'`, [session.accessToken]).then(r => r.rows[0])
    return res?.user_id
}

function error(res, message = 'not_logged_in') {
    res.statusCode = 500
    res.json({'error': message});
}